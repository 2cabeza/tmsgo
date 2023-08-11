import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCostPageRoutingModule } from './add-cost-routing.module';

import { AddCostPage } from './add-cost.page';
// import { UploadfileComponent } from 'src/app/components/uploadfile/uploadfile.component';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddCostPageRoutingModule,
    SharedModulsModule,
  ],
  declarations: [AddCostPage],
  exports: [AddCostPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AddCostPageModule {}
