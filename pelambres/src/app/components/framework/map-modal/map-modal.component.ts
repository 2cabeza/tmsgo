import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  modal_obj: any;
  longitude: number;
  latitude: number;
  maxHeight:boolean = true;

  title = "Mapa"

  constructor(navParams: NavParams) {
    setTimeout(()=> {
      try{
        this.latitude = Number(navParams.get('latitude'));
        this.longitude = Number(navParams.get('longitude'));
        this.modal_obj = navParams.get('modal');
        console.log('NavParams', this.latitude, this.longitude);
        
      }catch(ex){
        console.log('nav', ex)
      }
      }, 50);
    
   }

  ngOnInit() {

    

  }


  dismiss(changes: boolean = false, item: any = {}, cancel: boolean = false) {
    let obj: {};
    let items: any[] = [];


    items.push(obj);

    this.modal_obj.dismiss({
      'dismissed': true,
      'changes': changes,
      'items': items,
      'selectedItems': items,
      'item': obj,
      'cancel': cancel
    });
  }

}
