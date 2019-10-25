import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

    constructor(
        public dialogRef: MatDialogRef<EditTextComponent>,
        @Inject(MAT_DIALOG_DATA) data: EditTextParamsInterface
    ) {
        if ('short' in data && data.short) {
            this.shortText = true;
        }
        this.descriptionLabel = data.descriptionLabel;
        this.title = data.title ? data.title : 'Edit text';
        this.descriptionText = data.descriptionText ? data.descriptionText : undefined;
        this.saveLabel = data.saveLabel ? data.saveLabel : 'save';
        this.cancelLabel = data.cancelLabel ? data.cancelLabel : 'back';
        this.text = data.text ? data.text : '';
    }

    ngOnInit() {}

    onClose() {
        this.dialogRef.close();
    }

    onSave() {
        this.dialogRef.close(this.text);
    }
}
