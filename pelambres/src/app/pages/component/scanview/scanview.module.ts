import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanviewPageRoutingModule } from './scanview-routing.module';

import { ScanviewPage } from './scanview.page';
import { SharedModulsModule } from 'src/app/shared-moduls/shared-moduls.module';
import { SafePipeModule } from 'src/app/pipes/safe.pipe.module';
import { QRCodeModule } from 'angularx-qrcode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModulsModule,
    ReactiveFormsModule,
    ScanviewPageRoutingModule,
    SafePipeModule,
    QRCodeModule,
  ],
  declarations: [ScanviewPage]
  ,
  providers:[
    BarcodeScanner, QRScanner
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ScanviewPageModule {}
