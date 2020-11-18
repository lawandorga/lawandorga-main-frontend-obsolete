import { Component, OnInit, ViewChild } from '@angular/core';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection, QuillModule, QuillModules } from 'ngx-quill';
import 'quill-mention';
import 'quill-cursors';
import { QuillEditorComponent } from 'ngx-quill';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebrtcProvider } from 'y-webrtc';

@Component({
    selector: 'app-quill-test',
    templateUrl: './quill-test.component.html',
    styleUrls: ['./quill-test.component.scss']
})
export class QuillTestComponent implements OnInit {
    blurred = false;
    focused = false;
    model = '<p>hello there <span id="123123">dd</span></p>';
    quillRef: Quill;

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

            ['link', 'image', 'video'], // link and image, video
            ['table']
        ],
        cursors: true
    };

    constructor() {}

    ngOnInit(): void {}

    created(event: Quill) {
        // tslint:disable-next-line:no-console
        console.log('editor-created', event);
        this.quillRef = event;

        const cursors = this.quillRef.getModule('cursors');
        console.log('cursors: ', cursors);
        const cursor = cursors.createCursor('123', 'peter parker', 'red');
        cursors.moveCursor('123', { index: 0, length: 1, color: 'red' });

        // const table = this.quillRef.getModule('table');
        // console.log('table:', table);

        const ydoc = new Y.Doc();
        // clients connected to the same room-name share document updates
        // @ts-ignore
        const provider = new WebrtcProvider('your-room-name', ydoc, {
            password: 'optional-room-password'
        });
        const yarray = ydoc.get('array', Y.Array);
        provider.connect();
        provider.awareness.setLocalStateField('user', { name: 'bruce wayne' });
        const binding = new QuillBinding(ydoc.getText('quill'), event, provider.awareness);
        // tslint:disable-next-line:no-shadowed-variable
        provider.awareness.on('change', event => {
            console.log('change!!! ', event);
        });
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {
        // tslint:disable-next-line:no-console
        // console.log('editor-change', event);
        // console.log('model: ', this.model);
        // console.log('editor: ', this.editor);
    }

    focus($event) {
        // tslint:disable-next-line:no-console
        console.log('focus', $event);
        this.focused = true;
        this.blurred = false;
    }

    blur($event) {
        // tslint:disable-next-line:no-console
        console.log('blur', $event);
        this.focused = false;
        this.blurred = true;
    }
}
