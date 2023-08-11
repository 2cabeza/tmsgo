import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewRoutePage } from './view-route.page';

const routes: Routes = [
  {
    path: '',
    component: ViewRoutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutePageRoutingModule {}
