import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewRoutePageRoutingModule } from './view-route-routing.module';

import { ViewRoutePage } from './view-route.page';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleChartsModule,
    IonicModule,
    ViewRoutePageRoutingModule
  ],
  exports: [ViewRoutePage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ViewRoutePage]
})
export class ViewRoutePageModule {}
