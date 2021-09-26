import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { PrivacyStatementComponent } from './components/privacy-statement/privacy-statement.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:userid/:token', component: ResetPasswordComponent },
  { path: 'activate-account/:userid/:token', component: LoginComponent },
  { path: 'legal_notice', component: LegalNoticeComponent },
  { path: 'privacy_statement', component: PrivacyStatementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
