import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewDetailPageRoutingModule } from './view-detail-routing.module';

import { ViewDetailPage } from './view-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewDetailPageRoutingModule
  ],
  exports: [ViewDetailPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ViewDetailPage]
})
export class ViewDetailPageModule {}
