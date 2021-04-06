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
import {ConfirmTextParamsInterface} from '../../../shared/models/confirmTextParams.interface';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
    title: string;
    description: string;
    cancelLabel: string;
    confirmLabel: string;
    confirmColor: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: ConfirmTextParamsInterface
    ) {
        this.title = data.title ? data.title : 'Are you sure?';
        if (data.description) {
            this.description = data.description;
        }
        this.confirmLabel = data.confirmLabel ? data.confirmLabel : 'yes';
        this.cancelLabel = data.cancelLabel ? data.cancelLabel : 'no';
        this.confirmColor = data.confirmColor ? data.confirmColor : 'primary';
    }

    ngOnInit() {}

    onCancelClick() {
        this.dialogRef.close(false);
    }

    onConfirmClick() {
        this.dialogRef.close(true);
    }
}
