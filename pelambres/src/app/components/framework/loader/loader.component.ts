import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'go-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {

  constructor(public loading: LoadingController) { }

  ngOnInit() {
    this.start();
  }

  private async startLoader(message: string = null, duration: number = null) {
    message =  (message) ? message : 'Cargando...';
    duration =  (duration) ? duration : null;
    console.log('#loading start', message);
    const loading = await this.loading.create({
      spinner: "crescent",
      message: message,
      translucent: false,
      duration: duration,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('#loading end', message);
    console.log('Loading dismissed with role:', role);
  }

  public dismiss(){
    console.log('DISMISS');
    this.loading.dismiss();
  }

  public start(message: string = null, duration: number = null){
    this.startLoader(message, duration);
  }

}
