import { Component, Input, OnInit } from '@angular/core';
import { Utils } from '../../../../utils/utils'

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.page.html',
  styleUrls: ['./view-detail.page.scss'],
})
export class ViewDetailPage implements OnInit {
  @Input() item: any;

  constructor(public util: Utils) { }

  ngOnInit() {
  }

  getTypeColor(type: string){

    let color = 'medium'
    switch(type.toLowerCase()){
      case 'inicio':
        color = 'success'
        break
      case 'termino':
        color = 'danger'
        break
    }
    return color;
  }

}
