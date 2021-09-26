import { Component, OnInit } from '@angular/core';
import { AppSandboxService } from './core/services/app-sandbox.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authenticated: boolean;

  constructor(private appSB: AppSandboxService) {}

  ngOnInit(): void {
    this.appSB.startApp();
    this.appSB.getAuthenticated().subscribe((authenticated) => (this.authenticated = authenticated));
  }
}
