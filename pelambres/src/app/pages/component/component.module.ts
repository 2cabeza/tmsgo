import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentPageRoutingModule } from './component-routing.module';

import { ComponentPage } from './component.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMaterialModule } from 'src/app/models/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentPageRoutingModule,
    SharedModulsModule,
    ReactiveFormsModule,
    ScrollToModule.forRoot(),
    NgxDatatableModule,
    AngularMaterialModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  declarations: [ComponentPage]
})
export class ComponentPageModule {}
