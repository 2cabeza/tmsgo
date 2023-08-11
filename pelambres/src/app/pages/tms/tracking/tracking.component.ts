import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Location, PointObject } from 'src/app/models/models';
import { Tracking } from '../models/model';
import { ApisService } from '../services/apis.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
})
export class TrackingComponent implements OnInit {
  title = 'Tracking'


  constructor(private service: ApisService) { }

  points: PointObject[] = [
      // { latitude: '-31.777263884144862', longitude: '-70.96600680250283', icon: 'yellow'},
      // { latitude: '-31.764642142765307', longitude: '-70.98633457204542', icon: 'rose'},
      // { latitude: '-31.754497338227846', longitude: '-70.96381722769816', icon: 'green'},
      // { latitude: '-31.7906897130298', longitude: '-71.02424203156387', icon: 'blue'},
      // { latitude: '-31.80367465239504', longitude: '-70.93635140775919', icon: 'rose'},
      // { latitude: '-32.0461128407892', longitude: '-71.15453301489933', icon: 'red'},
      // { latitude: '-31.799149727901494', longitude: '-71.01934566183552', icon: 'green'},
      // { latitude: '-31.77835733898961', longitude: '-71.02518214856556', icon: 'blue'},
      // { latitude: '-31.748291305242983', longitude: '-70.93917979924663', icon: 'red'},
      // { latitude: '-31.737561497302025', longitude: '-70.95008029653489', icon: 'rose'},
      // { latitude: '-31.766317502682714', longitude: '-70.97085132286374', icon: 'yellow'},
      // { latitude: '-31.814832118104434', longitude: '-70.92295779934521', icon: 'blue'},
  ]

  ngOnInit() {
    this.getTracking()
  }


  getTracking() {
    this.service.getTracking().subscribe((response) => {
      const traking = response as Tracking[];
      let points: PointObject[] = [];
      console.log('response', response);
      console.log('traking', traking);
      for(let item of traking){
        console.log('item', item);
        let contentString =
        '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">Servicio Nº '+ item.service_order.id +'</h1>' +
        '<div id="bodyContent">' +
        '<p>Transportista: <b>' + item.service_order?.provider.name +'</b></p>' +
        "<p>creada " + moment(item.created).format('DD/MM/YYYY hh:mm') + '</p>' +
        '<p>Ver más detalles <a href="/tms/form/'+ item.service_order.id +'">' +
        "Aquí</a> .</p>" +
        "</div>" +
        "</div>";
        points.push({ latitude: item.latitude, 
                      longitude: item.longitude, 
                      icon: item.service_order?.provider?.color,
                      info: contentString,
                      num: item.service_order.id.toString()
                    });
      }
      console.log('points', points);
      this.points = points;
      
    })
  }

}
