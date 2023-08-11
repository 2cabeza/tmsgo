import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewCostsPage } from './view-costs.page';

const routes: Routes = [
  {
    path: '',
    component: ViewCostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewCostsPageRoutingModule {}
