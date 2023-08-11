import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanviewPage } from './scanview.page';

const routes: Routes = [
  {
    path: '',
    component: ScanviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanviewPageRoutingModule {}
