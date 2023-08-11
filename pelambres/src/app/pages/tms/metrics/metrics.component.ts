import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Provider } from 'src/app/models/models';
import { LogicsService } from 'src/app/services/logics.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {
  title = "Métricas"
  providers!: Provider[];

  data = [
    ["01/08", 2, 4, 0, 4],
    ["02/08", 3, 6, 1, 0],
    ["03/08", 2, 4, 2, 2],
    ["04/08", 6, 3, 0, 1]
 ];

 dataPie: any[];

 columnNames = ['Cumplimiento', 'Trans. AAA', 'Trans. BBB', 'Trans. CCC', 'Trans. DDD'];

 options = { 
  isStacked:false,
  height: 300,
  colors: ['#EE6B51', '#44AD78', '#1E82D6', '#E0BE48'],
  hAxis: {
     title: 'Cumplimiento'
  },
  legend: {position: 'top', maxLines: 3},
  vAxis: {minValue: 0}
};

options2 = { 
  isStacked:false,
  title: 'Estado de servicios',
  height: 300,
  colors: ['#EE6B51', '#44AD78', '#1E82D6', '#E0BE48'],
  hAxis: {
     title: 'Cumplimiento'
  },
  legend: {position: 'top', maxLines: 3},
  vAxis: {minValue: 0}
};

options3 = { 
  isStacked:false,
  title: '% de asignmación',
  height: 300,
  colors: ['#EE6B51', '#44AD78', '#1E82D6', '#E0BE48'],
  hAxis: {
     title: 'Cumplimiento'
  },
  legend: {position: 'top', maxLines: 3},
  vAxis: {minValue: 0}
};

options4 = { 
  isStacked:false,
  title: 'Tipo de servicio',
  height: 300,
  colors: ['#EE6B51', '#44AD78', '#1E82D6', '#E0BE48'],
  hAxis: {
     title: 'Cumplimiento'
  },
  legend: {position: 'top', maxLines: 3},
  vAxis: {minValue: 0}
};

  constructor(public util: Utils, private service: LogicsService) { }

  ngOnInit() {
    this.loadproviders();
  }

  loadproviders() {
    this.service.getProviders().subscribe((response) => {
      this.providers = response as Provider[];
      let data = [];
      for(let provider of this.providers){
        data.push([provider.name, provider.featured.qty_services]);
      }
      console.log(data)
      this.dataPie = data;
    })
  }
  

}
