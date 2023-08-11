import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OcupacionPageRoutingModule } from './ocupacion-routing.module';
import { OcupacionPage } from './ocupacion.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';
import { TasksModule } from 'aks-tasks'
// import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OcupacionPageRoutingModule,
    SharedModulsModule,
    TasksModule,
   // NgxChartsModule,
  ],

  declarations: [OcupacionPage ],
  entryComponents: [],

})
export class OcupacionPageModule { }
