import { Component, OnInit } from '@angular/core';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection, QuillModule, QuillModules } from 'ngx-quill';

// const parchment = Quill.import('parchment');
// const block = parchment.query('block');
// block.tagName = 'DIV';
// // or class NewBlock extends Block {} NewBlock.tagName = 'DIV'
// Quill.register(block /* or NewBlock */, true);
//
// interface Quill {
//     getModule(moduleName: string);
// }

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

    constructor() {}

    ngOnInit(): void {}

    private get tableModule(): BetterTableModule {
        return this.quillRef.getModule('better-table');
    }

    created(event: Quill) {
        // tslint:disable-next-line:no-console
        console.log('editor-created', event);
        this.quillRef = event;
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {
        // tslint:disable-next-line:no-console
        console.log('editor-change', event);
        console.log('model: ', this.model);
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
