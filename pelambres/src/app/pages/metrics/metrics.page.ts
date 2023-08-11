import { Component, OnInit } from '@angular/core';
import { LogicsService } from 'src/app/services/logics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
})
export class MetricsPage implements OnInit {

  options = {
    colors: ['#85B279', '#3182BA', '#81BCCE', '#1B97B9', '#BADAE5', '#78828B', '#479643']
  };

  options_2 = {
    bars: 'vertical', // Required for Material Bar Charts.
    colors: ['#85B279', '#3182BA', '#81BCCE', '#1B97B9', '#BADAE5', '#78828B', '#479643']
  };

  

  drawChartColumns = ['Mes', 'Activos', 'Inactivos'];
  drawChartData = [
    ['Oct', 88, 12],
    ['Sept', 80, 20],
    ['Ago', 85, 15],
    ['Jul', 77, 33]
  ];


  chartColumns = ['City', 'Inhabitants'];
  myData = [
    [
        "lala",
        33000.0
    ],
    [
        "Combustible",
        764000.0
    ],
    [
        "Viatico",
        118501.0
    ]
];


  chartColumns2 = ['City', 'Inhabitants'];
  myData2 = [
    ['Enero', 8136000],
    ['Febrero', 8538000],
    ['marzo', 2244000],
  ];


  chartColumns3 = ['Label', 'Value'];
  myData3 = [
    ['220', 90],
    ['250', 200],
    ['300', 150],
  ];


  myTitle = 'default';
  myType = 'PieChart';
  // per_equipment_cost
  avg_equipment_cost:any;

  // per_cost_type 
  per_cost_type_title = "Coste de flota por tipo de coste";
  per_cost_type_columns = ['Tipo de Costo', 'Coste Promedio'];
  per_cost_type_data = [];


  // per_equipment
  per_equipment_type_title = "Coste de flota por tipo de equipo";
  per_equipment_type_columns = ['Tipo Equipo', 'Coste Promedio'];
  per_equipment_type_data = [];
  

  // per_service_type
  per_service_type_title = "Coste de flota por tipo de servicio";
  per_service_type_columns = ['Tipo Servicio', 'Coste Promedio'];
  per_service_type_data = [];

  // cost_per_equipment
  cost_per_equipment_title = "Tabla de costos generales";
  // cost_per_equipment_columns = [{'string': "Month"}, {'number': "Sales"}];
  cost_per_equipment_columns = ['Equipo', 'Coste Promedio'];
  cost_per_equipment_data = [];

  constructor(private logicsService: LogicsService) { 
    this.getStatistics();
  }

  ngOnInit() {
  }

  // get cost type
  getStatistics() {
    this.logicsService.getStatistics().subscribe((response) => {
      console.log('response', response);
      this.per_cost_type_data = response['per_cost_type'];
      console.log('this.per_cost_type_data', this.per_cost_type_data)
      let avg_equipment_cost = this.numberFormat(response['avg_equipment_cost']);

      this.avg_equipment_cost = avg_equipment_cost;
      this.per_equipment_type_data = response['per_equipment_type'];
      this.per_service_type_data = response['per_service_type'];
      this.cost_per_equipment_data = response['cost_per_equipment']
      console.log(this.cost_per_equipment_data)
    }) 
  }

  numberFormat(number: any){
    number = parseInt(number);
    return new Intl.NumberFormat('es-CL').format(number);
  }

   draw() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1],
      ['Zucchini', 1],
      ['Pepperoni', 2]
    ]);
  }

}
