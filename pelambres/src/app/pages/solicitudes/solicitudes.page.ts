import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LogicsService } from 'src/app/services/logics.service';
import * as moment from 'moment';
import { Platform, ModalController, ToastController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RegistrarEventoPage } from '../registrar-evento/registrar-evento.page'
import { RegistroSolicitudPage } from '../registro-solicitud/registro-solicitud.page';
import { ServiceOrder, ServiceOrderInput, ServiceOrderSearch } from 'src/app/models/models';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationExtras } from '@angular/router';
import { SearchPage } from '../search/search.page';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ServiceOrderDetailPage } from '../service-order-detail/service-order-detail.page';
import  * as _ from 'lodash';
import { Utils } from 'src/app/utils/utils';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {

  serviceOrders: ServiceOrder[];
  isLoading: boolean;
  listaContratos: any;
  listaEquipos: any;
  listaConductores: any;
  listaNombreEquipos:  { [key: string]: Object }[] = [];
  listaNombreConductores:  { [key: string]: Object }[] = [];
  fechaInicio: any;
  fechaTermino: any;
  contracts: any;
  driver: any;
  equipment: any;
  cardVisible: boolean;
  public fields: Object = { value: "Name" };
  public text: string = "Buscar";
  public highlight: Boolean = true;

  public start_date: any;
  public end_date: any;
  customPickerOptions :any = "";
  cancelText = "Cancelar";
  doneText = "Confirmar";
  year: any = '';
  is_driver = false;
  is_admin = false;
  monthShortNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sept','Oct', 'Nov', 'Dic'];

  form: FormGroup;

  service_active: any;
  advance_actived = false;

  constructor(public modalController: ModalController, 
              private logicsService: LogicsService, 
              public platform: Platform, 
              @Inject(FormBuilder) private builder: FormBuilder,
              public toastController: ToastController,
              public authenticationService: AuthenticationService,
              private navController: NavController,
              private scrollToService: ScrollToService,
              public util: Utils,
              public keyboard: Keyboard
  ) {

    this.isLoading = true;
    this.year = moment().format('Y');
    this.start_date = moment().add(-2,'day').set({hour:0,minute:0,second:0,millisecond:0}).format();
    this.end_date = moment().add(2,'day').set({hour:23,minute:59,second:59,millisecond:0}).format();
    this.listaContratos = [];
    this.listaEquipos = [];
    this.listaConductores = [];
    this.cardVisible = true;
    this.fechaInicio = "";
    this.fechaTermino = "";
    this.driver = "";
    this.equipment = "";
    this.contracts = "";
    this.listaNombreEquipos = [];
    this.listaNombreConductores = [];
    
    this.initForm();

  }

  triggerScrollTo() {
    
    /**
     * @see NOTE:1
     */
    this.scrollToService
      .scrollTo({
        target: 'list-1'
      })
      .subscribe(
        value => { console.log(value) },
        err => console.error(err) // Error is caught and logged instead of thrown
      );
  }

  ngOnInit() {
    this.is_driver = this.authenticationService.is_group('drivers')
    this.is_admin = this.authenticationService.is_group('admin')
  }


  initForm() {
     // reactive form
    this.form = new FormGroup({
      search: new FormControl(),
      start_date: new FormControl(),
      end_date: new FormControl(),
      is_driver: new FormControl(0),
    });

    // reset view equipment
    this.equipment = null;
    // reset view driver
    this.driver = null;
  }

  ionViewWillEnter() {
    this.getServices();
    this.loadContract();
    
    this.validateWidth();
    this.platform.resize.subscribe(() => {
      this.validateWidth()
    });
  }

  validateWidth() {
    let devWidth = this.platform.width();
    if (devWidth < 995) {
      this.cardVisible = false;
    } else {
      this.cardVisible = true;
    }
  }

  activeItem(event) {
    console.log(event)
    if (!event.target.classList.contains('active')) {
      event.target.classList.add('active');
    } else {
      event.target.classList.remove('active');
    }
  }

  // capitalize
  setCapitalize(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }


  // get services
  async getServices() {
    this.keyboard.hide();
    this.isLoading = true;
    
    console.log('filter')

    let params = {
      'ordering': '-created',
      'limit': 12,
      'offset': 0,
    }

    this.serviceOrders = null;
    if(this.authenticationService.is_group('drivers')){
      this.form.controls['is_driver'].setValue(1);
      params['is_driver'] = 1;
    }

    if(this.form.value.search){
      params['search'] = this.form.value.search;
    }
    console.log('params', params);
    
    this.logicsService.getServicesFilter(params).subscribe((response) => {
      console.log('response: ', response)
      this.serviceOrders = Object.assign([new ServiceOrder()], response['results']);
      this.isLoading = false;
      // this.triggerScrollTo();
      // console.log('services: ', this.serviceOrders)
    })

  }

  // get contracts
  loadContract() {
    this.logicsService.getContractList().subscribe((response) => {
      this.contracts = response;
    })
  }

  

  // detail modal
  async presentModalDetail(service: any) {
    this.service_active = service;
    const modal = await this.modalController.create({
      component: ServiceOrderDetailPage,
      swipeToClose: true,
      componentProps: {
        'service': service,
        'modal': this
      }
    });
    // close event
    modal.onDidDismiss()
      .then((data) => {
        if(data['data'] != undefined){
          if(data['data']['changes']){
            let text = data['data']['action'];
            let message = 'Se ha ' + text + ' satisfactoriamente.';
            this.presentToast(message);
            this.getServices();
          }
        }
    });
    return await modal.present();
  }

  // report event modal
  async presentModalEvents(service: any) {
    this.service_active = service;
    const modal = await this.modalController.create({
      component: RegistrarEventoPage,
      swipeToClose: true,
      componentProps: {
        'service': service,
        'modal': this
      }
    });
    // close event
    modal.onDidDismiss()
      .then((data) => {
        if(data['data'] != undefined){
          if(data['data']['changes']){
            let text = data['data']['action'];
            let message = 'Se ha ' + text + ' satisfactoriamente.';
            this.presentToast(message);
            this.getServices();
          }
        }
    });
    return await modal.present();
  } 


  edit(service){
    const navigationExtras: NavigationExtras = {
      queryParams: { "sid": service['id'] },
    };   
    // this.navController.navigateRoot(['tms/form/'+service['id']],);
    this.navController.navigateRoot(['/tms/form/'+service['id']],);
    
  }

  // edit modal
  async presentModalEdit(service: any) {
    this.service_active = service;
    const modal = await this.modalController.create({
      component: RegistroSolicitudPage,
      swipeToClose: true,
      componentProps: {
        'service_item': 'service',
        'modal': this
      }
    });

    // close event
    modal.onDidDismiss()
      .then((data) => {
        if(data['data'] != undefined){
          if(data['data']['changes']){
            let text = data['data']['action'];
            let message = 'Se ha ' + text + ' satisfactoriamente.';
            this.presentToast(message);
            this.getServices();
          }
        }
    });
    return await modal.present();
  } 

  // toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      cssClass: 'toast-custom'
    });
    toast.present();
  }


  // search modal
  async presentSearch(action: string) {
    
    const modal = await this.modalController.create({
      component: SearchPage,
      swipeToClose: true,
      componentProps: {
        'action': action,
        'modal': this
      }
    });
    // response event
    modal.onDidDismiss()
    .then((data) => {

      if(data['data'] != undefined){
        console.log(data['data']['changes']);
        // if there are changes
        // if(data['data']['changes']){
        //   if(data['data']['cancel']){
        //     if(data['data']['action']=='equipments'){
        //       // reset hidden
        //       this.form.controls['equipments'].setValue('');
        //       // reset view equipment
        //       this.equipment = null;
        //     }
        //     if(data['data']['action']=='drivers'){
        //       // reset hidden
        //       this.form.controls['drivers'].setValue('');
        //       // reset view driver
        //       this.driver = null;
        //     }
        //   } 
        // else 
          if(data['data']['items']){
            // add equipment
            if(data['data']['action']=='equipments'){
              const current_equipments = _.cloneDeep(this.form.value.equipments);
              const matches = _.findIndex(current_equipments, function(e) { 
                return e.equipments.id === data['data']['items'][0].equipments.id; 
              });
              if (matches < 0){
                this.form.value.equipments.push(data['data']['items'][0])
              } else {
                this.presentToast("El equipo ya se encuentra seleccionado.");
              }
            }
            // add driver
            else if(data['data']['action']=='drivers'){
              const current_drivers = _.cloneDeep(this.form.value.drivers);
              const matches = _.findIndex(current_drivers, function(d) { 
                return d.drivers.id === data['data']['items'][0].drivers.id; 
              });
              if (matches < 0){
                this.form.value.drivers.push(data['data']['items'][0])
              } else {
                this.presentToast("El conductor ya se encuentra seleccionado.");
              }
            }
          }
        }
      });
    return await modal.present();
  }


  checkStatus(item: ServiceOrder){
    let status = {'color': 'success', 'text': 'INICIAR'};
    if(item){
      if(item.work_logs){
        for(let i of item.work_logs){
          if( i.type.code === 'I'){
            status = {'color': 'danger', 'text': 'FINALIZAR'};
          }
          if( i.type.code === 'T'){
            return {'color': 'medium', 'text': 'REPORTAR'};
          }
        }
      }
    }
    return status
  }

}
