import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroSolicitudPage } from './registro-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroSolicitudPageRoutingModule {}
