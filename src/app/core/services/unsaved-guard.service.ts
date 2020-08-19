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

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { HasUnsaved } from './can-have-unsaved.interface';
import { SharedSandboxService } from '../../shared/services/shared-sandbox.service';
import { bindCallback, Observable } from 'rxjs';

@Injectable()
export class UnsavedGuardService implements CanDeactivate<HasUnsaved> {
    constructor(private sharedSB: SharedSandboxService) {}

    canDeactivate(component: HasUnsaved): Observable<any> | boolean {
        if (!component.hasUnsaved()) return true;

        return new Observable<boolean>(observer => {
            this.sharedSB.openConfirmDialog(
                {
                    description:
                        'You have unsaved changes! If you leave, your changes will be lost.',
                    confirmLabel: 'leave',
                    confirmColor: 'warn',
                    cancelLabel: 'stay'
                },
                (leave: boolean) => {
                    observer.next(leave);
                    observer.complete();
                }
            );
        });
    }
}
