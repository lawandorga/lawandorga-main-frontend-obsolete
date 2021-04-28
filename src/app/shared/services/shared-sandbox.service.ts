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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTextComponent } from '../components/edit-text/edit-text.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { EditTextParamsInterface } from '../../shared/models/editTextParams.interface';
import { ConfirmTextParamsInterface } from '../../shared/models/confirmTextParams.interface';

@Injectable()
export class SharedSandboxService {
  constructor(public dialog: MatDialog) {}

  openEditTextDialog(data: EditTextParamsInterface, callback) {
    const dialogRef = this.dialog.open(EditTextComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      callback(result);
    });
  }

  openConfirmDialog(data: ConfirmTextParamsInterface, callback) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      callback(result);
    });
  }
}
