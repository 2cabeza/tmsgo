import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceOrderDetailPageRoutingModule } from './service-order-detail-routing.module';

import { ServiceOrderDetailPage } from './service-order-detail.page';
import { ViewDetailPageModule } from './views/view-detail/view-detail.module';
import { ViewCostsPageModule } from './views/view-costs/view-costs.module';
import { ViewRoutePageModule } from './views/view-route/view-route.module';
import { AddCostPageModule } from './add-cost/add-cost.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceOrderDetailPageRoutingModule,
    ViewDetailPageModule,
    ViewCostsPageModule,
    ViewRoutePageModule,
    AddCostPageModule
  ],
  declarations: [ServiceOrderDetailPage],
})
export class ServiceOrderDetailPageModule {}
