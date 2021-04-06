/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
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

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditTextParamsInterface} from '../../../shared/models/editTextParams.interface'

@Component({
    selector: 'app-edit-text',
    templateUrl: './edit-text.component.html',
    styleUrls: ['./edit-text.component.scss']
})
export class EditTextComponent implements OnInit {
    shortText = false;
    text = '';
    title: string;
    descriptionText: string;
    descriptionLabel: string;
    cancelLabel: string;
    saveLabel: string;
    saveColor: string;

    constructor(
        public dialogRef: MatDialogRef<EditTextComponent>,
        @Inject(MAT_DIALOG_DATA) data: EditTextParamsInterface
    ) {
        if ('short' in data && data.short) {
            this.shortText = true;
        }
        this.descriptionLabel = data.descriptionLabel;
        this.title = data.title ? data.title : 'Edit description_text';
        this.descriptionText = data.descriptionText ? data.descriptionText : undefined;
        this.saveLabel = data.saveLabel ? data.saveLabel : 'save';
        this.cancelLabel = data.cancelLabel ? data.cancelLabel : 'back';
        this.text = data.text ? data.text : '';
        this.saveColor = data.saveColor ? data.saveColor : 'primary';
    }

    ngOnInit() {}

    onClose() {
        this.dialogRef.close();
    }

    onSave() {
        this.dialogRef.close(this.text);
    }
}
