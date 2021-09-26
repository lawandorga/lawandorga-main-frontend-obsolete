import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppSandboxService } from '../../../core/services/app-sandbox.service';
import { Store } from '@ngrx/store';
import { TryLogin } from 'src/app/auth/store/actions';
import { Article } from 'src/app/core/models/article';
import { HttpClient } from '@angular/common/http';
import { RoadmapItem } from 'src/app/core/models/roadmapItem';
import { GetCheckUserActivationApiUrl } from 'src/app/statics/api_urls.statics';

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
        this.http.get(GetCheckUserActivationApiUrl(userId, token)).subscribe(
          () => {
            this.appSB.showSuccessSnackBar('Your email was confirmed.');
          },
          (error) => {
            if (error.status === 400) {
              this.appSB.showErrorSnackBar(error.error.message);
            } else {
              this.appSB.showErrorSnackBar('Your activation link is invalid.');
            }
          }
        );
      }
    });

    this.http.get('api/articles/').subscribe((response: Article[]) => (this.articles = response));
    this.http.get('api/pages/index/').subscribe((response: { content: string }) => (this.page = response));
    this.http.get('api/roadmap-items/').subscribe((response: RoadmapItem[]) => (this.roadmapItems = response));
  }

  onSend(data: { email: string; password: string }): void {
    this.store.dispatch(TryLogin({ username: data.email, password: data.password }));
  }
}
