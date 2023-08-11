import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroSolicitudPageRoutingModule } from './registro-solicitud-routing.module';

import { RegistroSolicitudPage } from './registro-solicitud.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistroSolicitudPageRoutingModule,
    SharedModulsModule,
  ],
  declarations: [RegistroSolicitudPage]
})
export class RegistroSolicitudPageModule { }
