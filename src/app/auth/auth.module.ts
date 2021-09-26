import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from '../auth/components/register/register.component';
import { LoginComponent } from '../auth/components/login/login.component';
import { ForgotPasswordComponent } from '../auth/components/forgot-password/forgot-password.component';
import { LegalNoticeComponent } from '../auth/components/legal-notice/legal-notice.component';
import { PrivacyStatementComponent } from '../auth/components/privacy-statement/privacy-statement.component';
import { ResetPasswordComponent } from '../auth/components/reset-password/reset-password.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/effects';
import { reducer } from './store/reducers';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule,
    CoreModule,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([AuthEffects]),
    // nada
  ],
  declarations: [
    ForgotPasswordComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LegalNoticeComponent,
    PrivacyStatementComponent,
    LoginComponent,
  ],
  providers: [AuthService],
})
export class AuthModule {}
