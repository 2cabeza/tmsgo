import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Utils } from 'src/app/utils/utils';
import * as _ from 'lodash';
import { ModalComponent } from './modal/modal.component';
import { LogicsService } from 'src/app/services/logics.service';

@Component({
  selector: 'go-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Input() form: any;
  @Input() many: boolean;
  @Input() reset: boolean;
  @Input() type: any;
  @Input() text: any = 'Item';
  @Input() icon: any;
  @Input() value: any;
  @Input() key: any;
  @Input() field: any;
  @Input() defaultData: any;
  @Input() defaultDataEndPoint: any;
  @Input() anchorField: any;
  // initial values list
  @Input() selectedItems: any[];
  @Input() contextId: any;
  @Input() parentObject: any;
  @Input() filter: any;
  @Input() exclude: any;
  @Input() selectedQuery: any;
  @Input() session: string;
  @Input() disabled: boolean = false;
  @Input() endPoint: string;
  @Input() firstLine: [];
  @Input() itemAdapter: String;
  @Input() secondLine: [];
  @Input() prefix: string;
  @Input() search: [];
  @Input() chipIcon: string;
  @Input() showChipIcon: boolean = false;
  @Input() apiFilter: any;
  @Input() apiExclude: any;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() onValue: EventEmitter<any> = new EventEmitter<any>();

  customObject: any;
  customObjectList: any[] = [];

  constructor(public modalController: ModalController,
    private service: LogicsService,
    public util: Utils) {
  }

  ngOnInit() {
    this.text = (this.many) ? this.text + ' (s)' : this.text;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges search', changes);
    if (changes) {
      // session
      try {
        if (changes.session.currentValue != changes.session.previousValue) {
          // console.log('## RESET ##');
          this.resetItem();
        }
      } catch (e) { }


      // default data
      try {
        if (changes.defaultData) {
          if (changes.defaultData['currentValue']) {
            this.customObjectList = changes.defaultData['currentValue'];
          }
        }
      } catch (error_) {
        console.log('defaultData error_', error_)
      }

      // pre selected data
      try {
        if (changes.selectedItems) {
          // console.log('selectedItems@', this.selectedItems)
          if (changes.selectedItems['currentValue']) {
            for (let it of changes.selectedItems['currentValue']) {
              // this.customObjectList.push(it)
              this.validateRepeat(it);
            }
            let result = (this.many==true) ? this.customObjectList : this.customObjectList?.length > 0 ? this.customObjectList[0] : [];
            this.select.emit(result);
          }
        }
      } catch (error_) {
        console.log('defaultData error_', error_)
      }

      // default parent object
      try {
        if (changes.parentObject) {
          if (changes.parentObject['currentValue']) {
            this.parentObject = changes.parentObject['currentValue'];
            let item = this.parentObject[this.type];
            if (item) {
              if (this.many === true) {
                this.customObjectList.push(item)
                console.log('many true', this.customObjectList);
              } else {
                this.customObject = item;
                this.customObjectList = [];
                this.customObjectList.push(item);
              }
            }
          }
        }
      } catch (error_) {
        console.log('defaultData error_', error_)
      }
    }

    if (changes['defaultDataEndPoint']) {
      console.log('defaultDataEndPoint', this.contextId)
      if (this.contextId) {
        let obj = new Map<string, string>();
        obj[this.anchorField] = this.contextId
        if (this.defaultDataEndPoint) {
          this.getCustomService(this.defaultDataEndPoint, obj)
        }
      }
    }
  }

  // search modal
  async presentSearch() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      swipeToClose: true,
      componentProps: {
        'action': this.type,
        'title': this.text,
        'filter': this.filter,
        'exclude': this.exclude,
        'selectedQuery': this.selectedQuery,
        'generic': true,
        'endPoint': this.endPoint,
        'apiFilter': this.apiFilter,
        'apiExclude': this.apiExclude,
        'icon': this.icon,
        'firstLine': this.firstLine,
        'itemAdapter': this.itemAdapter,
        'secondLine': this.secondLine,
        'prefix': this.prefix,
        'modal': this
      }
    });
    // response event
    modal.onDidDismiss()
      .then((data) => {
        let result: any;
        if (data.data != undefined) {
          if (data.data.changes) {
            if (data.data.item) {
              this.many = Boolean(this.many);
              if (this.many) {
                result = this.validateRepeat(data.data.item);

              } else {
                // get object
                this.customObjectList = [];
                this.customObjectList.push(data.data.item);
                result = data.data.item;
              }
              if (this.form) {
                this.form.controls[this.type].setValue(result);
              }

              this.select.emit(result);
              this.outputField(result)
            }
          }
        }
      });
    return await modal.present();
  }

  validateRepeat(item: any) {
    console.log('customObjectList', this.customObjectList)
    const current_items = _.cloneDeep(this.customObjectList);
    const matches = _.findIndex(current_items, function (i) {
      return i.id === item.id;
    });
    if (matches < 0) {
      this.customObjectList.push(item);
    } else {
      this.util.presentToast(this.text + " ya se encuentra seleccionado.");
    }
    return this.customObjectList;
  }

  removeItem(item: any) {
    console.log('remove item', item);
    let result: any;
    _.remove(this.customObjectList, function (o) {
      return o.id === item.id;
    });

    result = (this.many) ? this.customObjectList : null;
    if (this.form) {
      this.form.controls[this.type].setValue(result);
    }

    this.select.emit(result);
    this.outputField(result)
  }

  resetItem() {
    this.customObjectList = [];
    this.customObject = null;
  }

  additem(item: any) {
    // this.customObjectList.push(item);
  }

  /**
   * Generate map <field, item>
   * @param result 
   */
  outputField(result: any) {
    let output = new Map<string, any>();
    if (this.field) {
      output.set('field', this.field);
      output.set('value', result);
      this.onValue.emit(output);
    }
  }

  // get custom item
  getCustomService(endPoint: string = null, params = {}) {
    console.log('api context', endPoint, params)
    this.service.getService(endPoint, params).subscribe(
      (response) => {
        console.log('response custom', response)
        // generate map 
        let items = [];
        for (let item of response) {
          console.log('KEY', this.key, item[this.key])
          items.push(item[this.key])
        }
        // emit normal list
        if (items.length > 0) {
          this.customObjectList = items;
          this.select.emit(items);
          this.outputField(items);
        }
      },
      (error) => {
        console.log("Warning:", error);
      });

  }

}
