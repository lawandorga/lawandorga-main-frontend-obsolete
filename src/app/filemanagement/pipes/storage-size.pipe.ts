/*!
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

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'storageSize'
})
export class StorageSizePipe implements PipeTransform {
    private units: string[] = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

    transform(bytes: number = 0, precision: number = 2): string {
        let result: string;
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
            result = '?';
        } else {
            let unit = 0;

            while (bytes >= 1024) {
                bytes /= 1024;
                unit++;
            }

            result = bytes.toFixed(+precision) + ' ' + this.units[unit];
            result = result.replace('.', ',');
        }
        return result;
    }
}
