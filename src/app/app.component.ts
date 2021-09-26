import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AppSandboxService } from './core/services/app-sandbox.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authenticated: boolean;

  constructor(private appSB: AppSandboxService, private authService: AuthService) {}

  ngOnInit(): void {
    this.appSB.startApp();
    this.authService.getAuthenticated().subscribe((authenticated) => (this.authenticated = authenticated));
  }
}
