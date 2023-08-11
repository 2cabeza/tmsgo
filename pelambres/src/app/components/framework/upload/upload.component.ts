import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { AppFile } from 'src/app/models/models';
import { StorageService } from 'src/app/services/storage.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'go-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {

  @Input() form: any;
  @Input() id: any = 'default';
  @Input() disabled: boolean = false;
  @Input() many: boolean = false;
  @Input() temps: [] = [];
  @Input() session: string;
  @Output() upload: EventEmitter<AppFile> = new EventEmitter<AppFile>();
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  destroy$: Subject<null> = new Subject();
  fileToUpload: File;
  kittyImagePreview: string | ArrayBuffer;
  // pictureForm: FormGroup;
  submitted = false;
  uploadProgress$: Observable<number>;
  //user: firebase.User;

  // uploadPercent: Observable<number>;
  filename: any;
  // files = [];
  isLoading:boolean;
  ref:any;
  session_ = this.util.getNumber();
  constructor(
    // private storage: AngularFireStorage,
    private readonly storageService: StorageService,
              public util: Utils
              ) { 
                
              }

  ngOnInit() {
    console.log('ngOnInit');
    
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGE UPLOAD', changes);
    
    // this.destroy$ = new Subject();
    // session
    // try{
    //   if(changes.session.currentValue != changes.session.previousValue){
    //     console.log('## RESET ##');
    //     this.ngOnInit();
    //     this.resetFile();
    //   }
    // }catch(e){}
  }

  uploadFile(event: any) {
    this.isLoading = true;
    this.submitted = true;
    this.fileToUpload = event.target.files[0];
    const mediaFolderPath = `media/`;
    this.loading.emit(true);

    const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetadata(
      mediaFolderPath,
      this.fileToUpload,
    );
    console.log('name?', this.fileToUpload);

    this.uploadProgress$ = uploadProgress$;

    downloadUrl$
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.log('error_', error);
          // this.snackBar.open(`${ error.message } 😢`, 'Close', {
          //   duration: 4000,
          // });
          return EMPTY;
        }),
      )
      .subscribe((downloadUrl) => {
        this.isLoading = false;
        console.log('urlx', downloadUrl);
        this.loading.emit(false);
        let file = new AppFile();
        file.name = String(this.fileToUpload.name);
        file.value = downloadUrl;
        this.upload.emit(file);
        console.log('Emitido Upload');
        console.log('downloadUrlx', downloadUrl);
        // this.submitted = false;
        // this.router.navigate([ `/${ FEED }` ]);
      });
  }
  

  // // upload video event
  // uploadFile2(event: any) {
  //   this.isLoading = true;
  //   this.loading.emit(true);
  //   // this.uploadPercent = null;
  //   // this.util.startLoader();
  //   console.log(event);
  //   let file = event.target.files[0];
  //   console.log('file', file);
  //   if(file){
  //     // name file for upload
  //     let nameSplit = [];
  //     let randomCode = '_' + Math.random().toString(36).substring(2).substring(0,4);
  //     nameSplit = file.name.replace(" ","_").split('.');
  //     let extension = '.' + nameSplit[nameSplit.length-1];
  //     let nameFile = file.name.slice(0, (extension.length * -1));
  //     console.log('name1', nameFile);
  //     let nameExport = this.removeCharacter(nameFile) + randomCode + extension;
  //     console.log('name2', nameExport);
  //     // path cloud
  //     const filePath = '/' + nameExport;
  //     console.log('name3', filePath);
  //     const ref = this.storage.ref(filePath);
  //     const task = ref.put(file);
  //     // observe percentage changes
  //     // this.uploadPercent = task.percentageChanges();
  //     // end process
  //     task.snapshotChanges().pipe(   
  //       finalize(() => {
  //         // get url
  //         ref.getDownloadURL().subscribe(url => {
            
  //           this.isLoading = false;
  //           console.log('url', url);
  //           this.loading.emit(false);
  //           let file = new AppFile();
  //           file.name = nameExport;
  //           file.value = url;
  //           this.upload.emit(file);
  //           // console.log('filesx', this.files);
  //         });
  //       })
  //     ).subscribe()
  //   }else{
  //     this.loading.emit(false);
  //   }
  // }

  // remove string especial 
  removeCharacter(cadena){
    const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U',' ':'_'};
    cadena.split('').map( letra => acentos[letra] || letra).join('').toString();
    return cadena.substring(0, 20);	
  }

  resetFile(){
    console.log('RESET UPLOAD');
    // this.uploadPercent = null;
    this.filename = null;
    // this.files = [];
    // this.temps = [];
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter Upload');
  }

}
