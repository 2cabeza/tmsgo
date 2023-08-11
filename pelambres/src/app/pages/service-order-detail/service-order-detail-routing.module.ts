import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceOrderDetailPage } from './service-order-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceOrderDetailPage
  },
  {
    path: 'view-detail',
    loadChildren: () => import('./views/view-detail/view-detail.module').then( m => m.ViewDetailPageModule)
  },
  {
    path: 'view-costs',
    loadChildren: () => import('./views/view-costs/view-costs.module').then( m => m.ViewCostsPageModule)
  },
  {
    path: 'view-route',
    loadChildren: () => import('./views/view-route/view-route.module').then( m => m.ViewRoutePageModule)
  },
  {
    path: 'add-cost',
    loadChildren: () => import('./add-cost/add-cost.module').then( m => m.AddCostPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceOrderDetailPageRoutingModule {}
