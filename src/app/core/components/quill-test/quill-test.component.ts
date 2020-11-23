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
    model = '<p>asdfasdfasd <span style="background-color: rgb(255, 235, 204);">asdfsdf</span></p>';
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
        event.setText('<p>a<span style="background-color: rgb(240, 102, 102);">sdfdfd</span></p>');
        this.quillRef = event;

        // const cursors = this.quillRef.getModule('cursors');
        // console.log('cursors: ', cursors);
        // const cursor = cursors.createCursor('123', 'peter parker', 'red');
        // cursors.moveCursor('123', { index: 0, length: 1, color: 'red' });
        // const table = this.quillRef.getModule('table');
        // console.log('table:', table);

        const ydoc = new Y.Doc();
        // ydoc.clientID = 12839123; // setting own id! (for differentiating between users)
        // clients connected to the same room-name share document updates
        // @ts-ignore
        const provider = new WebrtcProvider('your-room-name', ydoc, {
            // generate room name and password in backend
            password: 'optional-room-password'
        });
        // const yarray = ydoc.get('array', Y.Array); // dont need it
        // provider.awareness.on('change', event => {
        //     // TODO: if quit an no one else here -> send current version to backend (maybe save, maybe just as draft)
        //     // console.log('change!!! ', event);
        //     // console.log('clientid: ', provider.doc.clientID);
        //     const states = provider.awareness.states.size;
        //     console.log('states: ', states);
        // });
        provider.connect();
        provider.awareness.setLocalStateField('user', { name: 'bruce wayne', id: '11111111' }); // showing correct name and id of user?
        const binding = new QuillBinding(ydoc.getText('quill'), event, provider.awareness);
        binding.awareness.once('update', () => {
            const states = provider.awareness.states.size;
            // check initial users
            console.log('states: ', states);
            if (states > 1) {
                console.log('im not alone in here');
            } else {
                console.log('im alone here');

                // event.setText(this.model);
            }
        });
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {
        // tslint:disable-next-line:no-console
        if (event.event !== 'selection-change') {
            console.log('editor-change, only html', event.html);
            console.log('editor-change, event', event);
        }
        // console.log('model: ', this.model);
        console.log('editor: ', this.editor);
        // console.log('html: ', event.html);
        // if (this.ydoc) {
        //     console.log('from ydoc: ', this.ydoc.getText('quill'));
        // }
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
