import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TmsPageRoutingModule } from './tms-routing.module';

import { TmsPage } from './tms.page';
import { FormComponent } from './form/form.component';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';
import { TrackingComponent } from './tracking/tracking.component';
import { MetricsComponent } from './metrics/metrics.component';
import { SearchComponent } from './search/search.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModulsModule,
    ReactiveFormsModule,
    TmsPageRoutingModule,
    GoogleChartsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [TmsPage, FormComponent, MetricsComponent, SearchComponent]
})
export class TmsPageModule {}
