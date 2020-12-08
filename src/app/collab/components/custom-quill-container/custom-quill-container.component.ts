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
    ChangeDetectorRef,
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
import { Room, WebrtcProvider } from 'y-webrtc';
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

    @ViewChild(QuillEditorComponent, { static: true }) editor: QuillEditorComponent;
    modules = {};

    constructor(
        private collabSB: CollabSandboxService,
        private coreSB: CoreSandboxService,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (this.editingMode === undefined) {
            throw new Error('editingMode must be specified');
        }
        if (this.editingMode) {
            this.modules = {
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
                                if (
                                    entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
                                    -1
                                ) {
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
            this.coreSB.getUserRestricted().subscribe((user: RestrictedUser) => {
                this.user = user;
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
        setTimeout(() => (this.loading = true), 0);
        this.changeDetector.detectChanges();
        if (this.quillRef && this.text_document && this.text_document.content !== undefined) {
            if (this.text_document.content === '') {
                // @ts-ignore
                this.quillRef.setContents([]);
            } else {
                const json = JSON.parse(this.text_document.content);
                this.quillRef.setContents(json);
            }
            this.loading = false;
            setTimeout(() => (this.loading = false), 0);

            console.log('loading false');
            this.changeDetector.detectChanges();
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
            // @ts-ignore
            this.provider = new WebrtcProvider(this.editing_room.room_id, ydoc, {
                password: this.editing_room.password
            });

            this.provider.connect();
            if (this.user) {
                this.provider.awareness.setLocalStateField('user', {
                    name: this.user.name,
                    id: this.user.id
                });
            }

            this.binding = new QuillBinding(
                ydoc.getText('quill'),
                this.quillRef,
                this.provider.awareness
            );

            // TODO: start timer here, if no update in 1 sec, take content from text_document???

            this.provider.awareness.once('update', () => {
                const states = this.provider.awareness.states.size;
                console.log('states: ', states);
                if (states > 1) {
                    console.log('im not alone in here');
                } else {
                    console.log('im alone here');
                    this.quillRef.setContents(JSON.parse(this.text_document.content));
                }
            });
        }
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
