import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormsPageRoutingModule } from './forms-routing.module';

import { FormsPage } from './forms.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';
import { WorkflowPageModule } from '../workflow/workflow.module';
import { SafePipeModule } from 'src/app/pipes/safe.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsPageRoutingModule,
    SharedModulsModule,
    ReactiveFormsModule,
    SafePipeModule,
    WorkflowPageModule
  ],
  entryComponents: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [FormsPage]
})
export class FormsPageModule {}
