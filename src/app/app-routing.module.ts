import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'records',
    loadChildren: () => import('./recordmanagement/records.module').then((m) => m.RecordsModule),
  },
  {
    path: 'files',
    loadChildren: () => import('./filemanagement/filemanagement.module').then((m) => m.FilemanagementModule),
  },
  {
    path: 'collab',
    loadChildren: () => import('./collab/collab.module').then((m) => m.CollabModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
