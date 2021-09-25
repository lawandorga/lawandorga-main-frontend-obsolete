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

import { Component, OnInit, ViewChild } from '@angular/core';
import { TextDocument } from '../../models/text-document.model';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CustomQuillContainerComponent } from '../../components/custom-quill-container/custom-quill-container.component';
import { EditingRoom } from '../../models/editing-room.model';

@Component({
  selector: 'app-collab-edit',
  templateUrl: './collab-edit.component.html',
  styleUrls: ['./collab-edit.component.scss'],
})
export class CollabEditComponent implements OnInit {
  text_document: TextDocument;
  editing_room: EditingRoom;
  editing_room_was_created: boolean;

  @ViewChild(CustomQuillContainerComponent) child: CustomQuillContainerComponent;

  constructor(private collabSB: CollabSandboxService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = Number(params['id']);
      this.collabSB.fetchTextDocument(id).subscribe((text_document: TextDocument) => {
        this.text_document = text_document;
      });
      this.collabSB.connectToEditingRoom(id).subscribe((response) => {
        this.editing_room = EditingRoom.getEditingRoomFromJson(response);
        this.editing_room_was_created = response.did_create;
      });
    });
  }

  hasUnsaved(): boolean {
    return this.child.hasUnsaved();
  }
}
