import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchPage } from 'src/app/pages/search/search.page';
import { Utils } from 'src/app/utils/utils';
import  * as _ from 'lodash';

@Component({
  selector: 'app-go-select',
  templateUrl: './go-select.component.html',
  styleUrls: ['./go-select.component.scss'],
})
export class GoSelectComponent implements OnInit {
  @Input() form: any;
  @Input() many: boolean;
  @Input() reset: boolean;
  @Input() type: any;
  @Input() text: any = 'Item';
  @Input() value: any;
  @Input() defaultData: any;

  

  customObject: any;
  customObjectList: any[] = [];
  
  constructor(public modalController: ModalController,
    public util: Utils) { 
    }

  ngOnInit() {
    this.text = (this.many)? this.text + ' (s)': this.text;
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('CHANGES', changes);
    if(changes){
      // reset
      try{
        if(changes.reset){
          if(changes.reset.currentValue){
            this.resetItem();
          }
        }
      }catch(error_){
        console.log('reset error_', error_)
      }

      // default data
      try{ 
        if(changes.defaultData){
          if(changes.defaultData['currentValue']){
            this.customObjectList = changes.defaultData['currentValue'];
          }
        }
      }catch(error_){
        console.log('defaultData error_', error_)
      }
      
    }
  }

  // search modal
  async presentSearch() {
    console.log('form', this.form);
    console.log('many', this.many);
    console.log('type', this.type);
    
    const modal = await this.modalController.create({
      component: SearchPage,
      swipeToClose: true,
      componentProps: {
        'action': this.type,
        'generic': true,
        'modal': this
      }
    });
    // response event
    modal.onDidDismiss()
    .then((data) => {
      
      if (data.data != undefined) {
        if (data.data.changes) {
          if (data.data.item) {
            console.log('item', data.data.item);
            this.many = Boolean(this.many);
            if (this.many) {
              const current_items = _.cloneDeep(this.customObjectList);
              const matches = _.findIndex(current_items, function(i) { 
                return i.id === data.data.item.id; 
              });
              if (matches < 0){
                this.customObjectList.push(data.data.item);
              } else {
                this.util.presentToast(this.text + " ya se encuentra seleccionado.");
              }
              this.form.controls[this.type].setValue(this.customObjectList);
            }else {
              this.customObjectList = [];
              this.customObjectList.push(data.data.item);
              this.form.controls[this.type].setValue(data.data.item);
              console.log('this.customObjectList', this.customObjectList);
            }
          }
        }
      }
    });
    return await modal.present();
  }

  removeItem(item: any){
    console.log('item', item);
     _.remove(this.customObjectList, function(o) {
      return o.id === item.id;
    });
    if(this.many){
      this.form.controls[this.type].setValue(this.customObjectList);
    }else{
      this.form.controls[this.type].setValue(null);
    }
    console.log('this.form', this.form.value);
  }

  resetItem(){
    this.customObjectList = []
  }

}
