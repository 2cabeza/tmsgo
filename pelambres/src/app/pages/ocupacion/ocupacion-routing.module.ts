import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OcupacionPage } from './ocupacion.page';

const routes: Routes = [
  {
    path: '',
    component: OcupacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OcupacionPageRoutingModule {}
