import { Component, OnInit, ViewChild } from '@angular/core';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection, QuillModule, QuillModules } from 'ngx-quill';
import 'quill-mention';
import 'quill-cursors';
// const parchment = Quill.import('parchment');
// const block = parchment.query('block');
// block.tagName = 'DIV';
// // or class NewBlock extends Block {} NewBlock.tagName = 'DIV'
// Quill.register(block /* or NewBlock */, true);
//
// interface Quill {
//     getModule(moduleName: string);
// }
import { QuillEditorComponent } from 'ngx-quill';

interface BetterTableModule {
    insertTable(rows: number, columns: number): void;
}

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

    // content;
    //
    // modules: QuillModules = {
    //     toolbar: [
    //         ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    //         ['blockquote', 'code-block'],
    //
    //         [{ header: 1 }, { header: 2 }], // custom button values
    //         [{ list: 'ordered' }, { list: 'bullet' }],
    //         [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    //         [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    //         [{ direction: 'rtl' }], // text direction
    //
    //         [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    //         [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //
    //         [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //         [{ font: [] }],
    //         [{ align: [] }],
    //
    //         ['clean'], // remove formatting button
    //
    //         ['link', 'image', 'video'], // link and image, video
    //         ['table']
    //     ],
    //     modules: {
    //         table: true
    //     }
    // };
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
        cursors: true,
        table: true,
        tableUI: true
        // 'better-table': true
    };

    constructor() {}

    ngOnInit(): void {}

    private get tableModule(): BetterTableModule {
        return this.quillRef.getModule('better-table');
    }

    created(event: Quill) {
        // tslint:disable-next-line:no-console
        console.log('editor-created', event);
        this.quillRef = event;

        const cursors = this.quillRef.getModule('cursors');
        console.log('cursors: ', cursors);
        const cursor = cursors.createCursor('123', 'peter parker', 'maroon');
        cursors.moveCursor('123', { index: 0, length: 3 });

        const table = this.quillRef.getModule('table');
        console.log('table:', table);
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {
        // tslint:disable-next-line:no-console
        console.log('editor-change', event);
        console.log('model: ', this.model);
        console.log('editor: ', this.editor);
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

    onInsertTableClick() {
        // const table = this.quillRef.getModule('better-table');
        // if (!table) {
        //     console.log('module table not found');
        // } else table.insertTable(3, 3);

        this.tableModule.insertTable(3, 3);
    }
}
