import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {AuthGuard} from '../guards/auth.guard';
import {AdminGuard} from '../guards/admin.guard';

import {PagesComponent} from './pages.component';


const routes: Routes = [
  {
    path: 'dashboard', component: PagesComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    // Lazy load:
    loadChildren: () => import('./child-routes.module').then(
      modulo => modulo.ChildRoutesModule
    )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
