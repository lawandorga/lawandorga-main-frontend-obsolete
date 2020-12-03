import { Component, OnInit } from '@angular/core';
import { UnsavedGuardService } from '../../../core/services/unsaved-guard.service';
import { HasUnsaved } from '../../../core/services/can-have-unsaved.interface';

@Component({
    selector: 'app-collab-edit',
    templateUrl: './collab-edit.component.html',
    styleUrls: ['./collab-edit.component.scss']
})
export class CollabEditComponent implements OnInit, HasUnsaved {
    constructor() {}

    ngOnInit(): void {}

    hasUnsaved(): boolean {
        return false;
    }
}
