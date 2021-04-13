import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Quill, { Delta } from 'quill';
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
  styleUrls: ['./quill-test.component.scss'],
})
export class QuillTestComponent implements OnInit, OnDestroy {
  model = '<p>asdfasdfasd <span style="background-color: rgb(255, 235, 204);">asdfsdf</span></p>';
  testModel = '{"ops":[{"insert":"asdfasd ehelalsd "},{"attributes":{"background":"#f06666"},"insert":"asdf"},{"insert":"\\n"}]}';
  quillRef: Quill;
  aloneTimer: NodeJS.Timeout;
  imalone: boolean;
  // provider: WebrtcProvider;
  // awareness: Awareness;

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
          { id: 2, value: 'Patrik Sjölin' },
        ];

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];

          values.forEach((entry) => {
            if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      },
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
    ],
    cursors: true,
  };

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // this.awareness.setLocalState(null);
  }

  created(event: Quill) {
    // tslint:disable-next-line:no-console
    // event.setText('<p>a<span style="background-color: rgb(240, 102, 102);">sdfdfd</span></p>');
    this.quillRef = event;

    const ydoc = new Y.Doc();
    // ydoc.clientID = 12839123; // setting own id! (for differentiating between users)
    // @ts-ignore
    const provider = new WebrtcProvider('law-orga-really-my-room', ydoc, {
      password: 'ladsflh',
    });

    provider.connect();
    provider.awareness.setLocalStateField('user', { name: 'bruce wayne', id: '11111111' }); // showing correct name and id of user?
    // this.awareness = provider.awareness;
    const binding = new QuillBinding(ydoc.getText('quill'), event, provider.awareness);

    if (binding.awareness.getStates().size <= 1) {
      // event.setContents(JSON.parse(this.testModel));
      this.imalone = true;
      this.aloneTimer = setTimeout(() => {
        if (this.imalone) {
          event.setContents(JSON.parse(this.testModel));
        }
      }, 1000);
    }

    binding.awareness.once('update', () => {
      const states = provider.awareness.states.size;
      // check initial users
      if (states > 1) {
        this.imalone = false;
      } else {
        // event.setContents(JSON.parse(this.testModel));
        // event.setText(this.testModel);
        this.imalone = true;
      }
    });
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    if (event.event !== 'selection-change') {
    } else {
      // editor.editor.delta.ops
    }
  }

  onShowCommentClick() {
    // first 5 chars, background color yellow/orange
  }
}
