/*
 * rlcapp - record and organization management software for refugee law clinics
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
 ******************************************************************************/

import { Component, OnInit } from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {EditTextComponent} from "../../../shared/components/edit-text/edit-text.component";
import {SharedSandboxService} from "../../../shared/services/shared-sandbox.service";

export interface Section {
    id: string;
    type: string;
    status: string;
}

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {
    constructor(public dialog: MatDialog, private sharedSB: SharedSandboxService) {
    }

    onDialogClick(){
        // this.sharedSB.openEditTextDialog('curVal', 'new token', (result) => {
        //     console.log('in component value', result);
        // });
        this.sharedSB.openConfirmDialog({
            // description: 'the description',
            // confirmText: 'confirm',
            // cancelText: 'cancel',
            // title: 'please confirm'
        }, (result) => {
            console.log('result of confirm', result);
        })
    }
}
