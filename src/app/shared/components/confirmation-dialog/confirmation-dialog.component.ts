import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: "app-confirmation-dialog",
    templateUrl: "./confirmation-dialog.component.html",
    styleUrls: ["./confirmation-dialog.component.scss"]
})
export class ConfirmationDialogComponent implements OnInit {
    title: string;
    description: string;
    cancelText: string;
    confirmText: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: ConfirmTextParamsInterface
    ) {
        this.title = data.title ? data.title : "Are you sure?";
        if (data.description) {
            this.description = data.description;
        }
        this.confirmText = data.confirmText ? data.confirmText : "yes";
        this.cancelText = data.cancelText ? data.cancelText : 'no';
    }

    ngOnInit() {
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }

    onConfirmClick() {
        this.dialogRef.close(true);
    }
}
