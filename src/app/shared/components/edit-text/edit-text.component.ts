import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-edit-text',
    templateUrl: './edit-text.component.html',
    styleUrls: ['./edit-text.component.scss']
})
export class EditTextComponent implements OnInit {

    shortText = false;
    text = "";
    description = "text";

    constructor(public dialogRef: MatDialogRef<EditTextComponent>, @Inject(MAT_DIALOG_DATA) data) {
        if (data.currentValue) {
            this.text = data.currentValue;
        }

        if (data.description){
            this.description = data.description;
        }

        if ('short' in data && data.short) {
            this.shortText = true;
        }
    }

    ngOnInit() {
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {
        this.dialogRef.close(this.text);
    }
}
