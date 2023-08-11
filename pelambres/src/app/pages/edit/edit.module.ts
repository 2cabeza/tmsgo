import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { RegistroSolicitudPageModule } from 'src/app/pages/registro-solicitud/registro-solicitud.module'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPageRoutingModule,
    RegistroSolicitudPageModule
  ],
  declarations: [EditPage],
  entryComponents: []
  ,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EditPageModule {}
