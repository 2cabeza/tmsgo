import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudesPageRoutingModule } from './solicitudes-routing.module';
import { SolicitudesPage } from './solicitudes.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SolicitudesPageRoutingModule,
    SharedModulsModule,
    ScrollToModule.forRoot(),
  ],


  declarations: [SolicitudesPage ],
  entryComponents: [],
  // providers: [Keyboard]
})
export class SolicitudesPageModule { }
