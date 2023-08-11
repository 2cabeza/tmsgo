import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppFile } from 'src/app/models/models';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadfileComponent implements OnInit {
  @Input() form: any;
  @Input() reset: boolean;
  @Input() many: boolean = false;
  @Input() temps: [] = [];
  @Input() session: string;
  @Output() statusForm: EventEmitter<any> = new EventEmitter<any>();

  uploadPercent: Observable<number>;
  filename: any;
  files:AppFile[] = [];

  constructor(private storage: AngularFireStorage,
              public loader: LoadingController,
              public util: Utils
              ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log('CHANGES', changes);
    // session
      try{
        if(changes.session){
          if(changes.session.currentValue != changes.session.previousValue){
            console.log('## RESET UPLOAD ##');
            this.resetFile();
          }
        }
        
      }catch(e){
        console.log(e);
      }
    // default parent object
    // try{ 
    //   if(changes.temps){
    //     if(changes.temps['currentValue']){
    //       this.temps = changes.temps['currentValue'];
          
    //     }
    //   }
    // }catch(error_){
    //   console.log('defaultData error_', error_)
    // }
  }

  // upload video event
  uploadFile(event: any) {
    this.uploadPercent = null;
    // this.util.startLoader();
    //console.log(this.event);
    let file = event.target.files[0];
    // console.log('file', file);
    if(file){
      // name file for upload
      let nameSplit = [];
      let randomCode = '_' + Math.random().toString(36).substring(2).substring(0,4);
      nameSplit = file.name.replace(" ","_").split('.');
      let extension = '.' + nameSplit[nameSplit.length-1];
      let nameFile = file.name.slice(0, (extension.length * -1));
      console.log('name1', nameFile);
      let nameExport = this.removeCharacter(nameFile) + randomCode + extension;
      console.log('name2', nameExport);
      // path cloud
      const filePath = '/' + nameExport;
      console.log('name3', filePath);
      const ref = this.storage.ref(filePath);
      const task = ref.put(file);
      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // end process
      task.snapshotChanges().pipe(     
        finalize(() => {
          // get url
          ref.getDownloadURL().subscribe(url => {
            console.log('url', url);
            this.uploadPercent=null;
            let file = new AppFile();
            file.name = nameExport;
            file.value = url;
            this.files.unshift(file);
            console.log('filesx', this.files);

            if (this.many){
              console.log('form upload', this.form);
              this.form.controls['files'].setValue(this.files);
            }else{
              this.form.controls['image'].setValue(url)
            }
            // this.util.loading.dismiss();
            
          });
        })
      ).subscribe()
    }
  }

  // remove string especial 
  removeCharacter(cadena){
    const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U',' ':'_'};
    cadena.split('').map( letra => acentos[letra] || letra).join('').toString();
    return cadena.substring(0, 20);	
  }

  resetFile(){
    this.uploadPercent = null;
    this.filename = null;
    this.files = [];
    this.temps = [];
  }


}
