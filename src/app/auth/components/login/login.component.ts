import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppSandboxService } from '../../../core/services/app-sandbox.service';
import { Store } from '@ngrx/store';
import { Login } from 'src/app/auth/store/actions';
import { Article } from 'src/app/core/models/article';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RoadmapItem } from 'src/app/core/models/roadmapItem';
import { DjangoError } from 'src/app/shared/services/axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  fields = [
    {
      label: 'E-Mail',
      type: 'email',
      tag: 'input',
      name: 'email',
      required: true,
    },
    {
      label: 'Password',
      type: 'password',
      tag: 'input',
      name: 'password',
      required: true,
    },
  ];
  errors: DjangoError;
  articles: Article[];
  page: {
    content: string;
  };
  roadmapItems: RoadmapItem[];

  activityItems = [{ id: 1, person: 'Lindsay Walton', project: 'Workcation', commit: '2d89f0c8', environment: 'production', time: '1h' }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSB: AppSandboxService,
    private store: Store,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.appSB.isAuthenticated()) {
      void this.router.navigate(['/dashboard/']);
    }

    // if an activation link was used try to activate the user
    // url: activate-user/:id/:token/
    this.route.params.subscribe((params: Params) => {
      const token: string = params['token'] as string;
      const userId: number = params['userid'] as number;
      if (token && userId) {
        this.http.post(`api/profiles/${userId}/activate/${token}/`, {}).subscribe(() => {
          this.appSB.showSuccessSnackBar('Your email was confirmed.');
        });
      }
    });

    this.http.get('api/articles/').subscribe((response: Article[]) => (this.articles = response));
    this.http.get('api/pages/index/').subscribe((response: { content: string }) => (this.page = response));
    this.http.get('api/roadmap-items/').subscribe((response: RoadmapItem[]) => (this.roadmapItems = response));
  }

  onSend(data: { email: string; password: string }): void {
    this.http.post('api/profiles/login/', data).subscribe({
      next: (response: { token: string; email: string; id: number; private_key: string }) => {
        this.store.dispatch(Login(response));
      },
      error: (error: HttpErrorResponse) => {
        this.errors = error.error as DjangoError;
      },
    });
  }
}
