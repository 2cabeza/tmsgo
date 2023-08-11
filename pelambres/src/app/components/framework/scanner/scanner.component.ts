import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'go-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit {
  @Output() value: EventEmitter<any> = new EventEmitter<any>();

  _message:string = "init";
  qr_code = new FormControl('', [Validators.required]);
  constructor() { }

  ngOnInit() {
    // this.scan2();
    try{
      eval("app.goEvent('scan');");
    }catch(e){ console.log('eval')}
  }

  scanner(){
    console.log(this.qr_code.value)
    if(this.qr_code.valid){
      this.value.emit(this.qr_code.value);
      this.qr_code.setValue('');
    }
    
  }
  
  scan(){
    // Optionally request the permission early
    // this._message += '|Init Scan';
    // this.qrScanner.prepare()
    // .then((status: QRScannerStatus) => {
    //   if (status.authorized) {
    //     // camera permission was granted
    //     this._message += '|Autorizado!:' + String(status.authorized);

    //     // start scanning
    //     let scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //       console.log('Scanned something', text);
    //         // this.qr_code.setValue(text);
    //         this._message = text;
    //       this.qrScanner.hide(); // hide camera preview
    //       scanSub.unsubscribe(); // stop scanning
    //     });

    //   } else if (status.denied) {
    //     this._message += '|Acceso denegado:' + String(status.denied);
    //     this.qrScanner.openSettings();
    //     // camera permission was permanently denied
    //     // you must use QRScanner.openSettings() method to guide the user to the settings page
    //     // then they can grant the permission from there
    //   } else {
    //     this._message += '|Acceso denegado, pero no sea preguntar?';
    //     // permission was denied, but not permanently. You can ask for permission again at a later time.
    //   }
    // })
    // .catch((e: any) => {
    //   console.log('Error is', e);
    //   this._message += '|Error Scan:' + String(e._message);
      
    // });
  }

  scan2(){
    this._message += '|Init Scan 2';
    const qrScanner: QRScanner = new QRScanner();

    const preview = (show: boolean): void => {
      if (show) {
        (window.document.querySelector("ion-app") as HTMLElement).classList.add("cameraView");
        window.document.body.style.backgroundColor = "transparent";
      } else {
        (window.document.querySelector("ion-app") as HTMLElement).classList.remove("cameraView");
        window.document.body.style.backgroundColor = '#FFF';
      }
    }
  this._message += '|prev ok ';

  qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      this._message += '| Scan ok';
      if (status.authorized) {
        this._message += '| auth';
        preview(true);
        // camera permission was granted
        qrScanner.show();
        this._message += '| show';
        // start scanning
        let scanSub = qrScanner.scan().subscribe((text: string) => {
          preview(false);
          console.log("Scanned something", text);
          this._message += '| data ' + text;
          qrScanner.hide(); // hide camera preview
          this._message += '| Scan hide';
          scanSub.unsubscribe(); // stop scanning
        });

      } else if (status.denied) {
        this._message += '| denegado';
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        this._message += '| denega otros';
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
    })
    .catch((e: any) => {
      console.log("Error is", e);
      this._message += '| error ' + String(e._message);
    });
  }

}
