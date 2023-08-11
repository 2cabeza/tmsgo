import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { LogicsService } from 'src/app/services/logics.service';
import { ActivatedRoute } from '@angular/router';
import { ProductInterface } from 'src/app/interfaz/ItemServicio';
import * as moment from 'moment';
import { ModalController, NavParams, IonSlides } from '@ionic/angular';
import { Utils } from '../../utils/utils'
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-service-order-detail',
  templateUrl: './service-order-detail.page.html',
  styleUrls: ['./service-order-detail.page.scss'],
})
export class ServiceOrderDetailPage implements OnInit {

  @Input() service: any;
  @Input() modal: ModalController;
  @ViewChild('slider', {static: true}) slider: IonSlides;


  modal_obj: any;
  item: any;
  detalleServicio: any;
  listaEventos: any
  styleStatus: any;

  start_tab_disabled: boolean = false;
  end_tab_disabled: boolean = false;

  tabs = new Map<number, string>();
  tab_active: string = 'details';


  slideOpts = {
    initialSlide: 0,
    speed: 400,
    preventClicks: true,
    preventClicksPropagation: true,
    zoom: {
      toggle: false
    }
  };

  constructor(
              navParams: NavParams,
              public utils: Utils,) { 

    this.item = navParams.get('service');
    this.modal_obj = navParams.get('modal');
    this.tabs.set(0, 'details');
    this.tabs.set(1, 'costs');
    this.tabs.set(2, 'route');
  }

  ngOnInit() {
  }




  changeTabs(event: any = null) {
    
    this.tab_active = (event)? event.detail.value : this.tab_active;

    switch (this.tab_active) {

      case 'details':
        this.slider.slideTo(0);
        break;

      case 'costs':
        this.slider.slideTo(1);
        break;

      case 'route':
        this.slider.slideTo(2);
        break;
    }
  }

  changeSlide(event: any = null) {

    this.slider.getActiveIndex().then(index => {
      this.tab_active = this.tabs.get(index);
   });
  }

  // stop click
  ionSlideTouchStart(){
    this.slider.lockSwipes(true);
    setTimeout(()=> {
      this.slider.lockSwipes(false);
      }, 150);
  }

  dismiss(status: boolean = false) {
    this.modal_obj.dismiss({
      'dismissed': true,
      'changes': status,
    });
  }

}
