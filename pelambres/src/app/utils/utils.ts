import { getNumberOfCurrencyDigits } from '@angular/common';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { MediaViewerComponent } from '../components/media-viewer/media-viewer.component';

@Injectable({
    providedIn: 'root'
    })

export class Utils{

    monthShortNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sept','Oct', 'Nov', 'Dic'];


    constructor(
        public toastController: ToastController, 
        public modalController: ModalController, 
      ){

    }
    // capitalize
    public setCapitalize(word: string) {
        if (!word) return word;
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
    // date format
    getDateFormat(date: any, format: string = 'DD/MM/YYYY HH:mm') {
        return moment(date).format(format)
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

  // selected focus text
  selectedFocus(event: any){
    let input: HTMLInputElement = event.target;
    if(input.type == 'number' && input.value == "0"){
      input.select();
    }
  }
  
  // true is day | false is night
  isDay(): Boolean{
    let result = moment().isBetween(
                                    moment().set('hour', 7),
                                    moment().set('hour', 20)
                                    );
    return result;

  }

  // toogle card
  toogleCard(event: any = null, max_height:any = null){
    // console.log('event', event);
    const element = event.target as HTMLElement;
    const content = element.nextSibling as HTMLElement;
    if(content.classList.contains('card-collapse-off')){
      content.classList.remove('card-collapse-off');
      content.classList.add('card-collapse-on')
    }
    else if(content.classList.contains('card-collapse-on')){
      content.classList.remove('card-collapse-on');
      content.classList.add('card-collapse-off')
    }

    if(content.classList.contains('card-collapse-100-off')){
      content.classList.remove('card-collapse-100-off');
      content.classList.add('card-collapse-100-on')
    }
    else if(content.classList.contains('card-collapse-100-on')){
      content.classList.remove('card-collapse-100-on');
      content.classList.add('card-collapse-100-off')
    }

    if(content.classList.contains('card-collapse-50-off')){
      content.classList.remove('card-collapse-50-off');
      content.classList.add('card-collapse-50-on')
    }
    else if(content.classList.contains('card-collapse-50-on')){
      content.classList.remove('card-collapse-50-on');
      content.classList.add('card-collapse-50-off')
    }
  }

  setMyStyles(color) {
    let styles = {
      'background-color': color,
    };
    return styles;
  }

  setStyleTextColor(color) {
    let styles = {
      'background-color': color,
      'color': 'white'
    };
    return styles;
  }


  // open image
  public async mediaViewer(item: any) {
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

  // temp session
  getNumber(){
    return moment().format('YYYYMMDDhmmss');
  }

  getHumansDate(date: any = null): string{
    let text = '';
    if(date){
      text += moment(date).fromNow()
    }
    return text;
  }

  
}




