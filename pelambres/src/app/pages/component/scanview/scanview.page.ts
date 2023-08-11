import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Utils } from 'src/app/utils/utils';
import { ApisService } from '../services/apis.service';
import { Appointment, Component as _Component, OperationResponse } from '../models/model';
import { ModalController, NavController } from '@ionic/angular';
import { MapComponent } from 'src/app/components/framework/map/map.component';
import { Location as _Location, Subsidiary} from 'src/app/models/models';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { MapModalComponent } from 'src/app/components/framework/map-modal/map-modal.component';

@Component({
  selector: 'app-scanview',
  templateUrl: './scanview.page.html',
  styleUrls: ['./scanview.page.scss'],
})
export class ScanviewPage implements OnInit {
  @ViewChild('qrCode',  {static: false}) qrCode: ElementRef;
  title = 'Mover QR';
  qr_code = new FormControl('', [Validators.required]);
  formScanning = true;
  isLoading = true;
  components: any[] = [];

  many = false;
  defaultData = null;
  // filters
  subsidiaries_path: any[];
  filterPath: any;
  filterSubsidiary: any;
  filterLocation: any;
  filterType: any;

  // excludes
  excludePath: any;
  excludeSubsidiary: any;
  excludeLocation: any;
  excludeType: any;

  sessionSubsidiary: string;
  sessionSubsidiary2: string;
  sessionLocation: string;

  disabledSubsidiary2 = true;
  disabledLocation = true;
  location: number;

  public myAngularxQrCode: string = null;

 // queries
 selectedQuerySubsidiaryPath: any;

 showPanel = true;

 // qr
//  preferFrontCamera : false, // iOS and Android
// showFlipCameraButton : true, // iOS and Android
// showTorchButton : true, // iOS and Android
// torchOn: false, // Android, launch with the torch switched on (if available)
// saveHistory: true, // Android, save scan history (default false)
// prompt : "Place a code inside the scan area”, // Android
// resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
// formats : "EAN_13,EAN_8,QR_CODE,PDF_417”, // default: all but PDF_417 and RSS_EXPANDED
// orientation : "portrait”, // Android only (portrait|landscape), default unset so it rotates with the device
  scannedData: any;
  encodedData: '';
  encodeData: any;
  inputData: any;
  _error = '';
  btnScan = '<requiere_scann/>';
  param: any = {};

  constructor(public util: Utils,
              private api: ApisService,
              private barcodeScanner: BarcodeScanner,
              private navController: NavController,
              private qrScanner: QRScanner,
              public modalController: ModalController) {
        this.myAngularxQrCode = 'Your QR code data string';
      }

  ngOnInit() {
    // this.qr_code.setValue('1111');
    // this.getComponents();
    this.filterPath = {parent_subsidiary : null};
    console.log('SCAN');
    try{
      eval('app.goEvent(\'scan\');');
    }catch (e){ console.log('eval'); }
  }

  createBarcode() {
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.inputData).then((encodedData) => {
      console.log(encodedData);
      this.encodedData = encodedData;
    }, (err) => {
      console.log('Error occured : ' + err);
    });
  }

  onSelectPath(event: Subsidiary){
    console.log('onSelectPath', event);

    this.sessionSubsidiary2 = this.util.getNumber();
    this.sessionLocation = this.util.getNumber();
    this.disabledSubsidiary2 = true;
    this.disabledLocation = true;

    if (event){
      this.disabledSubsidiary2 = false;
      this.filterSubsidiary = {parent_subsidiary: {id: event.id} };
    }
  }

  onSelectSubsidiary(event: Subsidiary){
    console.log('onSelectSubsidiary');
    this.sessionLocation = this.util.getNumber();
    this.disabledLocation = true;

    if (event){
      this.disabledLocation = false;
      this.filterLocation = {subsidiary: {id: event.id }};
      console.log('filter para location', this.filterLocation);
    }
  }

  onSelectLocation(item: any){
    console.log('location', item);
    this.location = item.id;

    // if(item){
    //   let location: Location = <Location>item;
    //   if(location.latitude && location.longitude){
    //     this.form.controls.longitude.setValue(location.longitude);
    //     this.form.controls.latitude.setValue(location.latitude);
    //     this.setMarker(location);
    //   }else{
    //     this.util.presentToast('Estan ubicación no contiene coordenadas.');
    //     this.clearContextMap();
    //   }
    // }else{
    //   this.clearContextMap();
    // }
  }


  // services
getComponents(event: any= null, field: string = '', params = null) {
  console.log('getComponents', event);
  if (event){
    if(params != null){
      this.param = params;
    }else{
      this.param[field] = event;
    }
    
    console.log('param', this.param);
    // get api
    this.api.getComponents(this.param).subscribe((response) => {
      console.log('response', response);
      const components = Object.assign([_Component], response);
      if (response?.length > 0) {
        console.log('components', components);
        const rows = [];
        for (const item of components){
          const row: _Component = Object.assign(new _Component(), item);
          rows.push(row.objectTable(false));
        }
        this.components = rows;
        console.log('components', this.components);
        
      }else{
          this.components = null;
      }
      this.isLoading = false;
    });
  }else{
    this.util.presentToast('No hay QR para buscar.');
  }
}

view(event:any){
  console.log('view', event)
  this.navController.navigateRoot(['component/forms/' + event]);

}

map(location: _Location = null){
  console.log('location', location);
  if (location){
    console.log('location', location.latitude, location.longitude);
    this.openMap(location.latitude, location.longitude);
  }
}

/** Post Component location */
postComponentLocation(id: any){
  console.log('getComponents');
  const param = {component: id, location: this.location};
  console.log('param', param);
  this.api.postComponentLocation(param).subscribe(
    (response: _Component) => {
      console.log('response', response);
      // this.postFiles(response);
      console.log('component location', response);
      this.util.presentToast('Se ha movido el inventario correctamente.');
      this.navController.navigateRoot(['component/scanview']);
      this.getComponents(1, null, this.param);
  },
  error => {
    // this.warning = JSON.stringify(error.error);
  });
}



public async openMap(latitude: any = null, longitude: any= null) {
  if (latitude){

   const modal = await this.modalController.create({
     component: MapModalComponent,
     swipeToClose: true,
     componentProps: {
      'latitude':latitude,
      'longitude':longitude,
       'modal': this
     }
   });

   // close event
   modal.onDidDismiss()
       .then((data) => {
         console.log(data);
   });
   return await modal.present();

  }else{
     return false;
  }
}

scanner(){
  this._error += '|Init';
  // this.scan2();
}

scan(){
  // Optionally request the permission early
  console.log('SCAN');
  try{
    // tslint:disable-next-line:no-eval
    eval('app.goEvent(\'open\');');
  }catch (e){
    console.log('eval');
  }
}

 




}
