import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})

export class EditPage implements OnInit {
  @Input() service_item: any;
  @Input() modal: ModalController;

  modal_obj: any;
  service: any;

  constructor() { 
    // if(navParams){
    //   this.service = navParams.get('service');
    // this.modal_obj = navParams.get('modal');
    // console.log(this.service);
    // }
    
  }

  ngOnInit() {
  }

}
