import { Component, Input, OnInit } from '@angular/core';
import { IonSlides, ModalController, PopoverController } from '@ionic/angular';
import { MediaViewerComponent } from 'src/app/components/media-viewer/media-viewer.component';
import { Utils } from 'src/app/utils/utils';
import { AddCostPage } from '../../add-cost/add-cost.page';

@Component({
  selector: 'app-view-costs',
  templateUrl: './view-costs.page.html',
  styleUrls: ['./view-costs.page.scss'],
})
export class ViewCostsPage implements OnInit {
  
  @Input() item: any;
  @Input() slider: IonSlides;
  
  constructor(public modalController: ModalController, public util: Utils) {
  }

  ngOnInit() {}

  add(){
    this.slider.lockSwipes(true);
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddCostPage,
      cssClass: 'add-element',
      componentProps: {
        'item': this.item,
        'modal': this,
        'windowType': 'popup'
      }
    });
    // response event
    modal.onDidDismiss()
    .then((data) => {
      console.log('response add cost', data)
    });
    return await modal.present();
  }

   // open image
   async mediaViewer(item: any) {
     if(item){

      const modal = await this.modalController.create({
        component: MediaViewerComponent,
        swipeToClose: true,
        componentProps: {
          'media': item,
          'type': 'image',
          'icon': 'icon',
          'modal': this
        }
      });

      // close event
      modal.onDidDismiss()
          .then((data) => {
            
      });
      return await modal.present();

     }else{
        return false;
     }
  } 


}
