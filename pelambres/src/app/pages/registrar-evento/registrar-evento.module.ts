import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RegistrarEventoPageRoutingModule } from './registrar-evento-routing.module';

import { RegistrarEventoPage } from './registrar-evento.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarEventoPageRoutingModule,
    SharedModulsModule
  ],
  declarations: [RegistrarEventoPage]
})
export class RegistrarEventoPageModule {}
