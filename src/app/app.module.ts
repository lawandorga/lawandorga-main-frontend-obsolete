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

import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { CustomMaterialModule } from './custom-material.module';
import { reducers } from './store/app.reducers';
import { AuthEffects } from './core/store/auth/auth.effects';
import { CoreSandboxService } from './core/services/core-sandbox.service';
import { CoreModule } from './core/core.module';
import { RecordsSandboxService } from './recordmanagement/services/records-sandbox.service';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { environment } from '../environments/environment';
import { AppSandboxService } from './core/services/app-sandbox.service';
import { StorageService } from './shared/services/storage.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { FilesSandboxService } from './filemanagement/services/files-sandbox.service';
import { SharedSandboxService } from './shared/services/shared-sandbox.service';
import { CookieService } from 'ngx-cookie-service';
import { QuillConfig, QuillModule } from 'ngx-quill';
import Quill from 'quill';
import QuillBetterTable from 'quill-better-table';
import QuillCursors from 'quill-cursors';

// Quill.register(
//     {
//         'modules/better-table': QuillBetterTable
//     },
//     true
// );
import * as QuillTableUI from 'quill-table-ui';

Quill.register('modules/tableUI', QuillTableUI.default);

Quill.register('modules/cursors', QuillCursors);
// Quill.register('modules/better-table', QuillBetterTable);
// Quill.register('modules/table');
const quillConfig: QuillConfig = {
    modules: {
        // table: false, // disable table module
        // 'better-table': {
        //     operationMenu: {
        //         items: {
        //             unmergeCells: {
        //                 text: 'Another unmerge cells name'
        //             }
        //         },
        //         color: {
        //             colors: ['#fff', 'red', 'rgb(0, 0, 0)'], // colors in operationMenu
        //             text: 'Background Colors' // subtitle
        //         }
        //     }
        // },
        // keyboard: {
        //     bindings: QuillBetterTable.keyboardBindings
        // },
        // 'better-table': true,
        cursors: true,
        table: true,
        tableUI: true
    }
};

registerLocaleData(localeDE);


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CustomMaterialModule,
        BrowserAnimationsModule,
        CoreModule,
        AppRoutingModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([AuthEffects]),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        QuillModule.forRoot(quillConfig)
    ],
    providers: [
        AuthGuardService,
        AppSandboxService,
        CoreSandboxService,
        RecordsSandboxService,
        FilesSandboxService,
        StorageService,
        SnackbarService,
        SharedSandboxService,
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: 'de' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
