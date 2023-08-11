import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { LogicsService } from 'src/app/services/logics.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Utils } from 'src/app/utils/utils';
import * as _ from 'lodash';
import { Filters } from 'src/app/models/models';

@Component({
  selector: 'go-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() action: any;
  @Input() modal: ModalController;
  @Input() generic: boolean = false;
  @Input() filter: any;
  @Input() exclude: any;
  @Input() selectedQuery: any;
  @Input() title: string = 'items';
  @Input() icon: string;
  @Input() firstLine: [];
  @Input() itemAdapter: String;
  @Input() secondLine: [];
  @Input() prefix: string;
  @Input() search: [];
  endPoint: string;
  apiFilter: any = {};
  apiExclude: any = {};

  actionText: string;
  modal_obj: any;
  search2 = new FormControl();

  items: any;
  selectedItems: any;
  _itemsAutoComplete: Observable<any[]>;
  isLoading = false;

  constructor(
    navParams: NavParams,
    private service: LogicsService,
    public utils: Utils,
    private platform: Platform,
  ) {
    this.action = navParams.get('action');
    this.modal_obj = navParams.get('modal');
    this.endPoint = navParams.get('endPoint');
    this.apiFilter = navParams.get('apiFilter');
    this.apiExclude = navParams.get('apiExclude');
    console.log('params', navParams)

    this.isLoading = true;

    if (this.endPoint) {
      const param = {};
      if (this.apiFilter['ordering']) {
        console.log('ordering exists')
        param['ordering'] = this.apiFilter['ordering']
        _.unset(this.apiFilter, 'ordering');
        console.log('sin ordering', this.apiFilter)
      }
      param['filter'] = JSON.stringify(this.apiFilter);
      param['exclude'] = JSON.stringify(this.apiExclude);
      console.log('param', param)

      this.customService(this.endPoint, param)
    }
    else if (this.action == 'drivers') {
      this.loadDrivers();
      this.title = 'Conductores';
    } else if (this.action == 'equipments') {
      this.loadEquipments();
      this.title = 'Equipos';
    } else if (this.action == 'origins') {
      this.loadSubsidiaries();
      this.title = 'Sucursal de origen';
    }
    else if (this.action == 'destinations') {
      this.loadSubsidiaries();
      this.title = 'Sucursal de destino';
    }
    else if (this.action == 'subsidiary') {
      this.loadSubsidiaries();
      this.title = 'Sucursal';
    }
    else if (this.action == 'location') {
      this.loadLocation();
      this.title = 'Ubicación';
    }
    else if (this.action == 'type') {
      this.loadType();
      this.title = 'Tipos';
    }

  }

  ngOnInit() {

    this.platform.backButton.subscribe(() => {
      // this does work
      console.log('ATRAS!');
    });
    this.search2.valueChanges.subscribe(value => {
      console.log('text', value)
    })

  }

  initAutoComplete() {

    this._itemsAutoComplete = this.search2.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


  }

  public _filter(value: string): any[] {

    const filterValue = value.toLowerCase();
    console.log('filterValue', filterValue)
    let items: [] = this.items;
    let filter: any;
    if (this.action == 'default') {
      filter = items.filter(
        option => JSON.stringify(
          option
        ).toLowerCase()
          .includes(filterValue));

    } else if (this.action == 'drivers') {
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

    } else if (this.action == 'equipments') {
      // equipments filter
      filter = items.filter(
        option => String(
          option['patent'] + '' +
          option['type']['name']
        ).toLowerCase()
          .includes(filterValue));
    } else if (this.action == 'origins' ||
      this.action == 'destinations' ||
      this.action == 'subsidiary'
    ) {
      // origin filter
      filter = items.filter(
        option => String(
          option['address'] + '' +
          option['name']
        ).toLowerCase()
          .includes(filterValue));
    }
    else if (this.action == 'location') {
      // origin filter
      filter = items.filter(
        option => String(
          option['name'] + '' +
          option['description']
        ).toLowerCase()
          .includes(filterValue));
    }
    else if (this.action == 'type') {
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

  customService(endPoint: string = null, params = {}) {
    this.service.getService(endPoint, params).subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      console.log(this.items);
      this.__filter();

    });
  }


  loadDrivers() {
    this.service.getDriverList().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      console.log(this.items);
      this.__filter();
    });
  }

  loadEquipments() {
    this.service.getEquipmentList().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      this.__filter();
      // console.log(this.items);
    });
  }

  loadSubsidiaries() {
    this.service.getSubsidiaries().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      this.__filter();
      this.__exclude();
    });
  }

  loadLocation() {
    this.service.getLocation().subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      this.__filter();
    });
  }

  loadType() {
    let param = {}
    // param['type_parent'] = 'INV';
    this.service.getType(param).subscribe((response) => {
      this.items = response;
      this.initAutoComplete();
      this.__filter();
    });
  }

  __filter() {
    if (this.filter) {
      this.items = _.filter(this.items, this.filter);
    }
    if (this.selectedQuery) {
      let cloneItems = _.cloneDeep(this.items);
      this.selectedItems = _.filter(cloneItems, this.selectedQuery);
    }
    this.isLoading = false;
  }

  __exclude() {
    if (this.exclude) {
      let exclude = this.exclude;
      this.items = _.filter(this.items, function (s) {

        if (String(exclude.name).search('-') == -1) {
          console.log('que si la tenga')
          let value = String(exclude.name).replace('-', '');
          return String(s.name).toLowerCase().search(String(exclude.name).toLowerCase()) != -1;


        } else {
          console.log('que no la tenga')
          let value = String(exclude.name).replace('-', '');
          return String(s.name).toLowerCase().search(String(value).toLowerCase()) == -1;

        }

      });
    }
  }



  dismiss(changes: boolean = false, item: any = {}, cancel: boolean = false) {
    let obj: {};
    let items: any[] = [];
    if (this.action == 'equipments') {
      obj = { 'equipments': item }
    }

    if (this.action == 'drivers') {
      obj = { 'drivers': item }
    }

    if (this.action == 'origins') {
      obj = { 'origins': item }
    }

    if (this.action == 'destinations') {
      obj = { 'destinations': item }
    }

    if (this.action == 'subsidiary') {
      obj = { 'subsidiary': item }
    }

    if (this.action == 'location') {
      obj = { 'location': item }
    }

    if (this.action == 'type') {
      obj = { 'type': item }
    }

    if (this.generic || this.action == 'default') {
      obj = item;
    }

    items.push(obj);

    this.modal_obj.dismiss({
      'dismissed': true,
      'changes': changes,
      'items': items,
      'selectedItems': items,
      'item': obj,
      'cancel': cancel,
      'action': this.action
    });
  }

  cancel() {

  }


}
