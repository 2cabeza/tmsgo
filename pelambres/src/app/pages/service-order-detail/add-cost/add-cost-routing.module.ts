import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCostPage } from './add-cost.page';

const routes: Routes = [
  {
    path: '',
    component: AddCostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCostPageRoutingModule {}
