import { Component, Input, OnInit } from '@angular/core';
import { Subsidiary } from 'src/app/models/models';

@Component({
  selector: 'app-btn-subsidiary',
  templateUrl: './btn-subsidiary.component.html',
  styleUrls: ['./btn-subsidiary.component.scss'],
})
export class BtnSubsidiaryComponent implements OnInit {
  @Input() subsidiary: Subsidiary;

  geo_ulr_1 = '';
  geo_ulr_2 = '';
  geo_ulr_3 = '';
  geo_ulr_4 = '';

  status = false;

  constructor() { }

  ngOnInit() {
    
    if(this.subsidiary.latitude && this.subsidiary.longitude){
      this.status = true;
      this.geo_ulr_1 = 'geo:0,0?q=' + this.subsidiary.latitude + ',' + this.subsidiary.longitude + '(' + this.subsidiary.name + ')';
      this.geo_ulr_2 = 'bingmaps:?cp=' + this.subsidiary.latitude + '~' + this.subsidiary.longitude;
      this.geo_ulr_3 = 'https://maps.apple.com/maps?q=' + this.subsidiary.latitude + ', ' + this.subsidiary.longitude;
      this.geo_ulr_4 = 'https://www.waze.com/ul?ll=' + this.subsidiary.latitude + '-' + this.subsidiary.longitude + '&navigate=yes&zoom=17';
    }
    

  }

}
