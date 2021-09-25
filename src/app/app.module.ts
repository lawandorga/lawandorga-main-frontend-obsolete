import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthEffects } from './core/store/auth/effects';
import { CoreSandboxService } from './core/services/core-sandbox.service';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { environment } from '../environments/environment';
import { AppSandboxService } from './core/services/app-sandbox.service';
import { StatisticsSandboxService } from './core/services/statistics-sandbox.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { SharedSandboxService } from './shared/services/shared-sandbox.service';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { CollabSandboxService } from './collab/services/collab-sandbox.service';
import { MaterialModule } from './material/material.module';
import { reducer as authReducer } from './core/store/auth/reducers';

Quill.register('modules/cursors', QuillCursors);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 24,
      logOnly: environment.production,
    }),
    QuillModule.forRoot({
      modules: {
        cursors: true,
        table: true,
        tableUI: true,
      },
    }),
  ],
  providers: [
    AppSandboxService,
    CoreSandboxService,
    CollabSandboxService,
    StatisticsSandboxService,
    SnackbarService,
    SharedSandboxService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
