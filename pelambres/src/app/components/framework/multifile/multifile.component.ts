import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppFile } from 'src/app/models/models';
import { Utils } from 'src/app/utils/utils';
import  * as _ from 'lodash';

@Component({
  selector: 'go-multifile',
  templateUrl: './multifile.component.html',
  styleUrls: ['./multifile.component.scss'],
})
export class MultifileComponent implements OnInit {
  @Output() uploads: EventEmitter<AppFile[]> = new EventEmitter<AppFile[]>();
  @Input() files: AppFile[] = [];

  constructor(public loader: LoadingController,
              public util: Utils) { }

  ngOnInit() {}

  onUploadLoading(event: boolean){
    if (event){
      this.startLoader("Cargando archivo...");
    }else{
      this.loader.dismiss();
    }
  }

  onUpload(item: AppFile){
    console.log('status', item);
    if(item){
      this.files.push(item);
    }
    this.uploads.emit(this.files);
    console.log('files', this.files);
  }

  removeFile(item: AppFile){
    _.remove(this.files, function(n:AppFile) {
     console.log('remove', n.name, item.name);
      return n.name == item.name;
    });
     
    console.log(this.files);
  }

  view(item:any){
    this.util.mediaViewer(item);
  }

  async startLoader(message:string = '') {
    message =  (message) ? message : 'Cargando...';
    const loading = await this.loader.create({
      spinner: "crescent",
      message: message,
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed with role:', role);
  }

}
