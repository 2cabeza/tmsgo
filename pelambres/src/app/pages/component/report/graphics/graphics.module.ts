import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphicsPageRoutingModule } from './graphics-routing.module';

import { GraphicsPage } from './graphics.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';
import { TasksModule } from 'aks-tasks'
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksModule,
    ReactiveFormsModule,
    SharedModulsModule,
    GraphicsPageRoutingModule,
    ChartsModule
  ],
  declarations: [GraphicsPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class GraphicsPageModule {}
