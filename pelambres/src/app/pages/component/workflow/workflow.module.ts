import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkflowPageRoutingModule } from './workflow-routing.module';

import { WorkflowPage } from './workflow.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkflowPageRoutingModule,
    SharedModulsModule,
    ReactiveFormsModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [WorkflowPage],
  exports:[WorkflowPage]
})
export class WorkflowPageModule {}
