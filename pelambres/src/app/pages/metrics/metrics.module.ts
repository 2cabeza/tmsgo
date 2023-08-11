import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';

import { IonicModule } from '@ionic/angular';

import { MetricsPageRoutingModule } from './metrics-routing.module';

import { MetricsPage } from './metrics.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GoogleChartsModule,
    IonicModule,
    MetricsPageRoutingModule,
    SharedModulsModule
  ],
  declarations: [MetricsPage]
})
export class MetricsPageModule {}
