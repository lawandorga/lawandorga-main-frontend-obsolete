import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageViewComponent } from './pages/page-view/page-view.component';
import { CollabEditComponent } from './pages/collab-edit/collab-edit.component';

const collabRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PageViewComponent,
  },
  {
    path: ':id',
    component: PageViewComponent,
  },
  {
    path: 'edit/:id',
    component: CollabEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(collabRoutes)],
  exports: [RouterModule],
})
export class CollabRoutingModule {}
