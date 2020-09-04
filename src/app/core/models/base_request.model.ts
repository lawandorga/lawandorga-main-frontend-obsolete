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

export enum BaseRequestStates {
    REQUESTED,
    ACCEPTED,
    DECLINED
}

export abstract class BaseRequest {
    public state: BaseRequestStates;

    public static getState(state: string): BaseRequestStates {
        if (state === 're') {
            return BaseRequestStates.REQUESTED;
        }
        if (state === 'ac') {
            return BaseRequestStates.ACCEPTED;
        }
        if (state === 'de') {
            return BaseRequestStates.DECLINED;
        }
    }
}
