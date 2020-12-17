/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2020  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import {
    Component,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { TextDocument } from '../../models/text-document.model';
import Quill, { Delta } from 'quill';
import { QuillEditorComponent } from 'ngx-quill';
import { HasUnsaved } from '../../../core/services/can-have-unsaved.interface';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { EditingRoom } from '../../models/editing-room.model';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import { RestrictedUser } from '../../../core/models/user.model';

@Component({
    selector: 'app-custom-quill-container',
    templateUrl: './custom-quill-container.component.html',
    styleUrls: ['./custom-quill-container.component.scss']
})
export class CustomQuillContainerComponent implements OnInit, OnChanges, OnDestroy, HasUnsaved {
    @Input()
    text_document: TextDocument;

    @Input()
    editingMode: boolean;

    @Input()
    did_create: boolean;

    @Input()
    editing_room: EditingRoom;

    quillRef: Quill;
    provider: WebrtcProvider;
    binding: QuillBinding;
    user: RestrictedUser;

    loading = false;
    connectedToPeers = false;

    @ViewChild(QuillEditorComponent, { static: true }) editor: QuillEditorComponent;
    modules = {
        mention: {
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            onSelect: (item, insertItem) => {
                const editor = this.editor;
                insertItem(item);
                // necessary because quill-mention triggers changes as 'api' instead of 'user'
                // editor.insertText(editor.getLength() - 1, '', 'user');
            },
            source: (searchTerm, renderList) => {
                const values = [
                    { id: 1, value: 'Fredrik Sundqvist' },
                    { id: 2, value: 'Patrik Sjölin' }
                ];

                if (searchTerm.length === 0) {
                    renderList(values, searchTerm);
                } else {
                    const matches = [];

                    values.forEach(entry => {
                        if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                            matches.push(entry);
                        }
                    });
                    renderList(matches, searchTerm);
                }
            }
        },
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote'],

            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction

            // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ['clean'], // remove formatting button

            ['link', 'image', 'video'] // link and image, video
        ],
        cursors: true
    };

    constructor(private collabSB: CollabSandboxService, private coreSB: CoreSandboxService) {}

    ngOnInit(): void {
        console.log('init custom-quill-container');
        if (this.editingMode === undefined) {
            throw new Error('editingMode must be specified');
        }
        if (!this.editingMode) {
            // this.modules = {};
        }
        if (this.editingMode) {
            this.coreSB.getUserRestricted().subscribe((user: RestrictedUser) => {
                this.user = user;
                if (this.provider && this.editingMode) {
                    console.log('user set afterwards');
                    this.setUser();
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('text_document' in changes) {
            this.text_document = changes['text_document']['currentValue'];
            this.initQuill();
        }
    }

    ngOnDestroy(): void {
        this.closeConnection();
    }

    closeConnection(): void {
        if (this.editingMode && this.provider) {
            this.provider.destroy();

            console.log('states: ', this.provider.awareness.states.size);
            if (this.provider.awareness.states.size === 1) {
                this.collabSB.closeEditingRoom(this.text_document.id);
            }
        }
    }

    @HostListener('window:beforeunload')
    beforeUnload() {
        this.closeConnection();
    }

    created(event: Quill): void {
        this.quillRef = event;
        this.initQuill();
    }

    initQuill(): void {
        console.log('loading true');
        this.loading = true;

        if (
            !this.editingMode &&
            this.quillRef &&
            this.text_document &&
            this.text_document.content !== undefined
        ) {
            if (this.text_document.content === '') {
                // @ts-ignore
                this.quillRef.setContents([]);
            } else {
                setTimeout(() => {
                    console.log('set content in timeout');
                    const json = JSON.parse(this.text_document.content);
                    this.quillRef.setContents(json);
                }, 0);
            }
            setTimeout(() => {
                this.loading = false;
                console.log('loading false');
            }, 0);
        }
        if (!this.editingMode) {
            if (this.quillRef) this.quillRef.enable(false);
            return;
        }
        if (this.editing_room && this.editingMode) {
            if (this.provider) {
                this.provider.destroy();
            }

            const ydoc = new Y.Doc();
            console.log('connecting to room: ', this.editing_room.room_id);
            // @ts-ignore
            this.provider = new WebrtcProvider(this.editing_room.room_id, ydoc, {
                password: this.editing_room.password,
                signaling: ['wss://y-webrtc-signaling-eu.herokuapp.com/']
            });

            this.provider.connect();
            if (this.user) {
                this.setUser();
            } else {
                console.error('user not ready to set');
            }

            this.binding = new QuillBinding(
                ydoc.getText('quill'),
                this.quillRef,
                this.provider.awareness
            );

            this.loading = true;
            console.log('content length: ', this.text_document.content.length);
            setTimeout(() => {
                console.log('timer hitted');
                if (!this.connectedToPeers && this.provider.awareness.getStates().size === 1) {
                    console.log('no connection happened so settings contents');
                    this.quillRef.setContents(JSON.parse(this.text_document.content));
                    this.connectedToPeers = true;
                }
                this.loading = false;
            }, this.text_document.content.length * 0.5);

            this.provider.awareness.once('update', () => {
                const states = this.provider.awareness.states.size;
                console.log('UPDATE');
                console.log('states: ', states);
                this.connectedToPeers = true;
                if (states > 1) {
                    console.log('im not alone in here');
                } else {
                    console.log('im alone here');
                    this.quillRef.setContents(JSON.parse(this.text_document.content));
                }
                this.loading = false;
            });
        }
    }

    setUser(): void {
        this.provider.awareness.setLocalStateField('user', {
            name: this.user.name,
            id: this.user.id
        });
    }

    hasUnsaved(): boolean {
        // TODO: implement
        const ret_value = false;
        return ret_value;
    }

    onSaveClick(): void {
        const stringified = JSON.stringify(this.quillRef.getContents());
        console.log('on save click: ', stringified);
        this.collabSB.saveTextDocument(this.text_document.id, stringified);
    }
}
