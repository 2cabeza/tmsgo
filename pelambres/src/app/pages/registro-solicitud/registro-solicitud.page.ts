import { Component, OnInit } from '@angular/core';
import { LogicsService } from 'src/app/services/logics.service';
import { NavController, ModalController, NavParams, NumericValueAccessor, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { ServiceOrder, ServiceOrderFilter, ServiceOrderInput, Subsidiary } from 'src/app/models/models';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { SearchPage } from '../search/search.page';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import  * as _ from 'lodash';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-registro-solicitud',
  templateUrl: './registro-solicitud.page.html',
  styleUrls: ['./registro-solicitud.page.scss'],
})

export class RegistroSolicitudPage implements OnInit {
  service_item: ServiceOrder;
  title: string = "Nuevo Servicio";
  nav: NavParams;
  equipmentMany = true;
  defaultData: any;
  reset = false;
  generic = true;
  
  isLoading: boolean;
  // dates
  public start_date: any;
  public end_date: any;

  contracts: [] = []
  types: [] = []
  cost_centers: [] = []
  equipments: [] = [];
  equipmentsTemp : Observable<any[]>;
  
  equipments_selected: any;
  drivers_selected: any;

  form: FormGroup;
  formBuilder: FormBuilder;
  year: any = '';
  customPickerOptions :any = "";

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  cancelText = "Cancelar";
  doneText = "Confirmar";
  monthShortNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sept','Oct', 'Nov', 'Dic'];
  
  constructor(public modalController: ModalController,
              private service: LogicsService, 
              public toastController: ToastController,
              public util: Utils,
              private route: ActivatedRoute,
              private navController: NavController) { 

    this.isLoading = false;


    this.loadContract();
    this.loadCentros();
    this.loadServiceOrderTypelist();
    this.start_date = moment().add(1,'hour').set({minute:0,second:0,millisecond:0}).format();
    console.log('start_date', this.start_date);
    this.year = moment().format('Y');
    this.end_date = moment().add(1,'day').set({hour:9,minute:0,second:0,millisecond:0}).format();

    // reactive form
    this.form = new FormGroup({
        
        cost_center: new FormControl(),
        service_date: new FormControl(this.start_date, [Validators.required, ]),
        estimated_closing_date: new FormControl(this.end_date),
        equipments: new FormControl([]),
        drivers: new FormControl([]),
        origins: new FormControl([]),
        destinations: new FormControl([]),
        address: new FormControl('',),
        amount: new FormControl(0),
        office_guide: new FormControl(''),
        priority: new FormControl(false),
        reference: new FormControl(''),
        contract: new FormControl(),
        type: new FormControl(),
        weight: new FormControl(0.0),
        volume: new FormControl(0.0),
    });
    
  }

  compare(val1: any, val2: any) {
    return val1.id === val2.id;
  }

  handleChange(event: any) {
    console.log('event', event);
  }

  ngOnInit() {
    console.log('ID', this.route.snapshot.paramMap.get("sid"));
    if(this.route.snapshot.paramMap.get("sid")){
      this.getServiceId(this.route.snapshot.paramMap.get("sid"));
    }
  }


  onSubmit(){
    if(this.form.valid){

      let service: ServiceOrderFilter = this.form.value;
      this.isLoading = true;
      console.log('form', this.form.value);
      // copy objects
      const params: ServiceOrderInput =  Object.assign(new ServiceOrderInput(), this.form.value);
      
      if(this.service_item){
        params['service_id'] = this.service_item['id'];
      }
      console.log('params', params);
      // return false;
      // console.log('toObject', params.deserialize());
      this.service.postServiceForm(params).subscribe((response) => {

        this.isLoading = false;
        if(response['status']==true){
          let message_text  = '';
          if(this.service_item){
            message_text = this.service_item['id'] + ' ha sido editado.';
          }else{
            message_text = response['data'].id + ' ha sido registrado.';
          }
          this.presentToast('Servicio #' + message_text);
          this.navController.navigateRoot(['services/']);
        }else{
          this.presentToast('Problemas al guardar. Informe el siguiente error: ' + response['message']);
        }
      });
    }else{
      this.presentToast('Existen campos obligatorios');
    }
    
  }

  // search modal
  async presentSearch(action: string) {
    // if(action=='drivers'){
    //   this.generic = false;
    // }
    const modal = await this.modalController.create({
      component: SearchPage,
      swipeToClose: true,
      componentProps: {
        'action': action,
        'modal': this,
        'generic': this.generic
      }
  });

    // response event
    modal.onDidDismiss()
      .then((data) => {
        console.log('data', data);
        if(data['data'] != undefined){
          if(data['data']['changes']){
            if(data['data']['item']){
              // add equipment
              // if(data['data']['action']=='equipments'){
              //   const current_equipments = _.cloneDeep(this.form.value.equipments);
              //   const matches = _.findIndex(current_equipments, function(e) { 
              //     return e.equipments.id === data['data']['items'][0].equipments.id; 
              //   });
              //   if (matches < 0){
              //     this.form.value.equipments.push(data['data']['items'][0])
              //   } else {
              //     this.presentToast("El equipo ya se encuentra seleccionado.");
              //   }
              // }
              // add driver
              // else 
              if(data['data']['action']=='drivers'){
                const current_drivers = _.cloneDeep(this.form.value.drivers);
                const matches = _.findIndex(current_drivers, function(d) { 
                  
                  return d.driver.id === data['data']['item'].id; 
                });
                if (matches < 0){
                  let driver = {driver: data['data']['item']}
                  this.form.value.drivers.push(driver)
                } else {
                  this.presentToast("El conductor ya se encuentra seleccionado.");
                }
              }
              // add origin
              else if(data['data']['action']=='origins'){
                this.form.controls['origins'].setValue(data['data']['items']);
              }
              // add destination
              else if(data['data']['action']=='destinations'){
                this.form.controls['destinations'].setValue(data['data']['items']);
                try{
                  let destinations:[] = data['data']['items'];
                  console.log('destinations', destinations);
                  if(destinations.length > 0){
                    for(let d of destinations){
                      console.log('d.address', d['address']);
                      this.form.controls['address'].setValue(d['address']);
                    }
                  }
                }catch(error_){
                  console.log('destinations error_', error_);
                }
                
                
              }
            }
            console.log('form', this.form);
          }
        }
    });
    return await modal.present();
  }

  removeItem(item: any, param: any){
    console.log('item', param, item)
     _.remove(this.form.value[param], function(o) {
       console.log('o' ,o)
      return o.id === item.id;
    });
    console.log('this.form.value[param]', this.form.value[param]);

  }

  // toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      cssClass: 'toast-custom',
      position: 'middle',
      buttons: [
         {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }


    // get service id
  async getServiceId(id: any) {
    console.log('getServiceId')
    let query = {}
    query['service_id'] = id
    const query_str = new HttpParams({ fromObject: query }).toString();
    this.form.disable();
    console.log('query_str', id);
    this.service.getServicesId(id).subscribe((response) => {
      console.log('response', response);
      this.service_item = Object.assign(new ServiceOrder(), response);
      // this.equipments_selected = (this.service_item['equipments'].length > 0) ? this.service_item['equipments'] : [];
      // this.drivers_selected = this.service_item['drivers'].length > 0 ? this.service_item['drivers'] : [];
      this.form.patchValue(this.service_item);
      const equipments: [] = []
      if (this.service_item.equipments) {
        for(let equipment of this.service_item.equipments){
          equipments.push(equipment['equipment'])
        }
        this.defaultData = equipments;
      }
      this.form.controls['equipments'].setValue(equipments);
      this.form.controls['drivers'].setValue(this.service_item.drivers);
      if(this.service_item.origin){
        this.form.controls['origins'].setValue([this.service_item.origin]);
      }
      if(this.service_item.destination){
        this.form.controls['destinations'].setValue([this.service_item.destination]);
      }
      
      console.log('form serv', this.form.value);
      this.title = "Edición de servicio #" + this.service_item['id'];
      this.form.enable();
    });
  
  }

  loadContract() {
    this.service.getContractList().subscribe((response) => {
      this.contracts = <[]>response;
    })
  }

  loadCentros() {
    this.service.getCenterCost().subscribe((response) => {
      this.cost_centers = <[]>response;
    })
  }

  loadServiceOrderTypelist() {
    this.service.getServiceOrderTypeList().subscribe((response) => {
      this.types = <[]>response;
      console.log('types',  <[]>response);
    })
  }
    
}
