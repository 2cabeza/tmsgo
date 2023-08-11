import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { LogicsService } from 'src/app/services/logics.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @Input() action: any;
  @Input() modal: ModalController;
  @Input() generic: boolean = false;

  actionText: string;
  modal_obj: any;

  title: string = 'items';
  search = new FormControl();
  
  items: any;
  itemsAutoComplete : Observable<any[]>;


  constructor(
      navParams: NavParams,
      private service: LogicsService,
      public utils: Utils,
      private platform: Platform,
    ) { 
    this.action = navParams.get('action');
    this.modal_obj = navParams.get('modal');
    if(this.action=='drivers'){
      this.loadDrivers();
      this.title = 'Conductores';
    }else if(this.action=='equipments'){
      this.loadEquipments();
      this.title = 'Equipos';
    }else if(this.action=='origins'){
      this.loadSubsidiaries();
      this.title = 'Sucursal de origen';
    }
    else if(this.action=='destinations'){
      this.loadSubsidiaries();
      this.title = 'Sucursal de destino';
    }
    else if(this.action=='subsidiary'){
      this.loadSubsidiaries();
      this.title = 'Sucursal';
    }
    else if(this.action=='location'){
      this.loadLocation();
      this.title = 'Ubicación';
    }
    else if(this.action=='type'){
      this.loadType();
      this.title = 'Tipos';
    }
    
  }

  ngOnInit() {

    this.platform.backButton.subscribe(() => {
      // this does work
      console.log('ATRAS!');
    });
    
  }

  initAutoComplete(){
    this.itemsAutoComplete = this.search.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    console.log('filterValue old', filterValue)
    let items: [] = this.items;
    let filter: any;

    if(this.action=='drivers'){
      // drivers filter
      filter = items.filter(
        option => String(
          option['user_profile']['ni'] + '' +
          option['user_profile']['personal_email'] + '' +
          option['user_profile']['personal_phone'] + '' +
          option['user_profile']['user']['email'] + '' +
          option['user_profile']['user']['first_name'] + '' +
          option['user_profile']['user']['last_name'] + '' +
          option['user_profile']['user']['username'] + '' 
        ).toLowerCase()
      .includes(filterValue));

    }else if(this.action=='equipments'){
      // equipments filter
      filter = items.filter(
        option => String(
          option['patent'] + '' +
          option['type']['name'] 
        ).toLowerCase()
      .includes(filterValue));
    }else if(this.action=='origins' || 
            this.action=='destinations' ||
            this.action=='subsidiary'
            ){
      // origin filter
      filter = items.filter(
        option => String(
          option['address'] + '' +
          option['name'] 
        ).toLowerCase()
      .includes(filterValue));
    }
    else if(this.action=='location'){
      // origin filter
      filter = items.filter(
        option => String(
          option['name'] + '' +
          option['description'] 
        ).toLowerCase()
      .includes(filterValue));
    }
    else if(this.action=='type'){
      // origin filter
      filter = items.filter(
        option => String(
          option['name'] + '' +
          option['description'] 
        ).toLowerCase()
      .includes(filterValue));
    }
    
    return filter;
  }


  loadDrivers() {
    this.service.getDriverList().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      console.log(this.items);
    });
  }

  loadEquipments() {
      this.service.getEquipmentList().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      // console.log(this.items);
    });
  }

  loadSubsidiaries() {
    this.service.getSubsidiaries().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      console.log('subsidiary', this.items);
    });
  }

  loadLocation() {
    this.service.getLocation().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      console.log('location', this.items);
    });
  }

  loadType() {
    let param = {}
    param['type_parent'] = 'INV';
    this.service.getType(param).subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      console.log('type', this.items);
    });
  }

  dismiss(changes: boolean = false, item: any = {}, cancel: boolean = false) {
    let obj: {};
    let items: any[] = [];
    if(this.action == 'equipments'){
      obj = { 'equipments': item}
    }

    if(this.action == 'drivers'){
      obj = { 'drivers': item}
    }

    if(this.action == 'origins'){
      obj = { 'origins': item}
    }

    if(this.action == 'destinations'){
      obj = { 'destinations': item}
    }

    if(this.action == 'subsidiary'){
      obj = { 'subsidiary': item}
    }

    if(this.action == 'location'){
      obj = { 'location': item}
    }

    if(this.action == 'type'){
      obj = { 'type': item}
    }

    if(this.generic){
      obj = item;
    }
    
    items.push(obj);
    
    this.modal_obj.dismiss({
      'dismissed': true,
      'changes': changes,
      'items': items,
      'item': obj,
      'cancel': cancel,
      'action': this.action
    });
  }

  cancel(){
    
  }
}

interface Items {
  key: string;
  value?: string;
}
