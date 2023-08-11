import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/utils/utils';
import { Field, Process, StatusForm, Workflow } from '../models/model';
import  * as _ from 'lodash';
import { SearchComponent } from 'src/app/components/framework/search/search.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ApisService } from '../services/apis.service';
import { Component as _Component, File as _File} from '../models/model';
import { LoadingController, NavController } from '@ionic/angular';
import { AppFile } from 'src/app/models/models';



@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.page.html',
  styleUrls: ['./workflow.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})


export class WorkflowPage implements OnInit {
  @Input() item: Workflow;
  @Input() session: string;
  @Input() previous_status: boolean;
  @Input() component: _Component;
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('type',  {static: false}) type: SearchComponent;
  @Output() statusForm: EventEmitter<StatusForm> = new EventEmitter<StatusForm>();

  many = false;
  reset = true;
  defaultData = null;
  filterType: any;
  existBtn = false;
  files: AppFile[] = [];

  selectedState: any[];
  form: FormGroup;
  formState: string = 'disabled';
  formVisible = false;
  formEdit = false;
  isModified = false;
  maxQty: number;

  constructor(public util: Utils, 
    private api: ApisService,
    public loader: LoadingController,
    private navController: NavController,
    public authenticationService: AuthenticationService) { 
    this.initForm();
  }

  ngOnInit() {
    this.permissions();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('workflow item', this.item);
    // console.log('changes', changes);
    // session
    try{
      if(changes.session.currentValue != changes.session.previousValue){
        // console.log('## RESET ##');
        this._resetForm();
      }
    }catch(e){

    }
    if(this.item){
      if (this.item.state){
        this.selectedState = [];
        this.selectedState.push(this.item.state);
        this.form.controls.state.setValue(this.item.state);
        // console.log('w this.selectedState', this.selectedState)
      }
      
      this.form.valueChanges.subscribe(val => {
        this.isModified = true;
      });
      this.patchValues();
    }
    
  }

  permissions(){
    // per process and perfil MEL
    
    if(this.item.code == 'MEL'){
      // console.log('ES MEL', this.item.code)
      this.filterType = {'type_parent': {'code' : 'MEL'}};
      if(this.authenticationService.is_group('inventariador')){
        this.setStateForm('visible');
      }
      if(this.authenticationService.is_group('venta')){
        this.setStateForm('visible');
      }
      if(this.authenticationService.is_group('romanero')){
        this.setStateForm('visible');
      }
      if(this.authenticationService.is_group('mel')){
        console.log('VENTA !!!!!! TRUE')
        this.setStateForm('editable');
        this.existBtn = true;
        // console.log('this.previous_status', this.previous_status)
        if(!this.previous_status){
          this.setStateForm('visible');
        }
        if( this.item.processed ){
          this.setStateForm('visible');
        }
      }else{
        console.log('VENTA !!!!!! False')
      }
      if(this.authenticationService.is_group('admin')){
        this.setStateForm('editable');
      }
    }
    // per process and perfil VTA
    if(this.item.code == 'VTA'){
      this.filterType = {'type_parent': {'code' : 'VTA'}};
      if(this.authenticationService.is_group('mel')){
        this.setStateForm('hidden');
      }
      if(this.authenticationService.is_group('inventariador')){
        this.setStateForm('hidden');
      }
      if(this.authenticationService.is_group('romanero')){
        this.setStateForm('visible');
      }
      if(this.authenticationService.is_group('venta')){
        this.setStateForm('editable');
        this.existBtn = true;
        console.log(this.previous_status, this.previous_status);
        if(!this.previous_status){
          this.setStateForm('visible');
        }
        if( this.item.processed ){
          this.setStateForm('visible');
        }
      }
      if(this.authenticationService.is_group('admin')){
        this.setStateForm('editable');
      }
    }

    // per process and perfil ROM
    if(this.item.code == 'ROM'){
      this.filterType = {'type_parent': {'code' : 'ROM'}};
      if(this.authenticationService.is_group('mel')){
        this.setStateForm('hidden');
      }
      if(this.authenticationService.is_group('inventariador')){
        this.setStateForm('hidden');
      }
      if(this.authenticationService.is_group('venta')){
        this.setStateForm('hidden');
      }
      if(this.authenticationService.is_group('romanero')){
        this.setStateForm('editable');
        this.existBtn = true;
        console.log(this.previous_status, this.previous_status);
        if(!this.previous_status){
          this.setStateForm('visible');
        }
        if( this.item.processed ){
          this.setStateForm('visible');
        }
      }
      if(this.authenticationService.is_group('admin')){
        this.setStateForm('editable');
      }
    }
  }

  patchValues(){
    this.form.patchValue(this.item);
    if(this.item.files){
      for(let file of this.item.files){
        this.files.push(
          {'name': file.key, 'value': file.value}
        )
      }
    }
    
    console.log('FILE', this.item.process.code, this.files)
    if(this.authenticationService.is_group('mel')){
      if(this.component){
        this.maxQty = this.component.quantity;
        if(this.component.quantity == null){
          this.form.controls.value_1.setValue(this.component.quantity);
        }
        this.form.controls.value_1.setValidators([Validators.max(this.component.quantity)])
      }
    }
    
    this.isModified = false;
  }

  emit(code: any, state: boolean = true, message: string){
    let status =  new StatusForm();
    status.code = code;
    status.state = state;
    status.message = message;
    this.statusForm.emit(status);
  }

  setStateForm(state: string){

    if(state === 'visible'){
      this.formVisible = true;
      this.formEdit = false;
      // form reactive disabled
    }
    if(state === 'editable'){
      this.formVisible = true;
      this.formEdit = true;
    }
    if(state === 'hidden'){
      this.formVisible = false;
      this.formEdit = false;
      // form reactive disabled
    }
    return state;
  }

  initForm(){
    // reactive form
    this.form = new FormGroup({
      value_1: new FormControl(''),
      value_2: new FormControl(''),
      value_3: new FormControl(''),
      state: new FormControl(),
      observation: new FormControl(''),
      description: new FormControl(''),
      priority: new FormControl(false),
      processed: new FormControl(false)
    });
  }

  _resetForm(){
    this.form.reset();
    this.initForm();
    if (this.type){
      this.type.resetItem();
    }
  }

  onSelectState(event: any){
    console.log('state workflow', event);
    this.form.controls.state.setValue(event);
  }

  getField(value: any){
    if (this.item.process){
      if ( this.item.process.field_list ){
        let mach:Field = _.find(this.item.process.field_list, { 'key': value });
        return mach;
      }
    }
    return null;
  }

  checkVisible(value: any){
    let mach = this.getField(value);
    if (mach){
      return true;
    }
    return false;
  }
  

  transform(value: any){
    let mach = this.getField(value);
    if (mach){
      return (mach.value) ? mach.value: value;
    }
    return value;
  }

  getType(value: any){
    let mach = this.getField(value);
    let type = 'text';
    if (mach){
      if (mach.type){
        type = (mach.type === 'number+') ? 'number' : mach.type;
      }
    }
    return type;
  }

  getMinNumber(value: any){
    let mach = this.getField(value);
    let min = '';
    if (mach){
      if (mach.type){
        min = (mach.type === 'number+') ? '0' : min;
      }
    }
    return min;
  }

  getColor(item: Process){
    if (item.color){
      let style = {
        'background-color': item.color,
      };
      return style;
    }else{
      return {}
    }
  }

  onSubmit(event: any = null){
    this.emit(this.item.code, true, 'Guardando proceso.');
    console.log('event', event);
    let form = _.cloneDeep(this.form.value);
    form['files'] = Object.assign([new AppFile()], this.files);
    // let merge = _.merge(this.item, formDeep);
    // let item: Workflow = Object.assign(new Workflow(), merge);
    // console.log('workflow', item);
    this.putWorkflow(this.item.id, form);
  }

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

  /** Put Component */
  putWorkflow(id:any, data: any){
    this.api.putWorkflow(id, data).subscribe(
      (response) => {
        console.log('response workflow', response);
        
        setTimeout(()=> {
          this.isModified = false;
          _.merge(this.item, response);
          this.emit(this.item.code, false, 'OK');
          this.permissions();
        }, 1000);
        
      },
      error =>{
        console.log('error workflow', error);
        // this.warning = JSON.stringify(error.error);
      });
  }

  exit(){
    this.navController.navigateRoot(['component/']);
  }
}
