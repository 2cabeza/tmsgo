import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form/form.component';
import { MetricsComponent } from './metrics/metrics.component';

import { TmsPage } from './tms.page';
import { TrackingComponent } from './tracking/tracking.component';

const routes: Routes = [
  {
    path: '',
    component: TmsPage
  },
  {
    path: 'form', component: FormComponent
  },
  {
    path: 'form/:sid', component: FormComponent
  },
  {
    path: 'tracking', component: TrackingComponent
  },
  {
    path: 'metrics', component: MetricsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TmsPageRoutingModule {}
