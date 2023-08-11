import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarEventoPage } from './registrar-evento.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarEventoPageRoutingModule {}
