import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCostsPageRoutingModule } from './view-costs-routing.module';

import { ViewCostsPage } from './view-costs.page';
import { AddCostPageModule } from '../../add-cost/add-cost.module';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ViewCostsPageRoutingModule,
    AddCostPageModule,
    SharedModulsModule
  ],
  exports: [ViewCostsPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ViewCostsPage]
})
export class ViewCostsPageModule {}
