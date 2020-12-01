import { Component, OnInit } from '@angular/core';
import { CollabSandboxService } from '../../services/collab-sandbox.service';

@Component({
    selector: 'app-collab-main-view',
    templateUrl: './collab-main-view.component.html',
    styleUrls: ['./collab-main-view.component.scss']
})
export class CollabMainViewComponent implements OnInit {
    constructor(public collabSB: CollabSandboxService) {}

    ngOnInit(): void {
        this.collabSB.startLoadingAllDocuments();
    }
}
