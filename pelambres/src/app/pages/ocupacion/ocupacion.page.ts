import { Component, OnInit } from '@angular/core';
import { LogicsService } from 'src/app/services/logics.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { TasksComponent } from 'aks-tasks';

@Component({
  selector: 'app-ocupacion',
  templateUrl: './ocupacion.page.html',
  styleUrls: ['./ocupacion.page.scss'],
})
export class OcupacionPage implements OnInit {
  static componentName = 'OcupacionPage';
  // @ViewChild('gantt') ganttChild;
  iView: boolean;

  isLoading: boolean = false;

  listaDisponible: any;
  listaOcupados: any;

  fechaInicio: any;

  form: FormGroup;
  formBuilder: FormBuilder;

  static_form = {};

  public current_date: any;
  public yesteday: any;
  public tomorrow: any;

  // calendar
  customPickerOptions :any = "";
  cancelText = "Cancelar";
  doneText = "Confirmar";
  monthShortNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sept','Oct', 'Nov', 'Dic'];
  year: any = '';
  public start_date: any;
  public end_date: any;

  /** charts */
  view: any[] = [600, 400];


  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };

  //pie
  showLabels = true;

  /* gantt */
  settings1: any;
  settings2: any = {};
  data = [];
  data2 = [];

  constructor(private logicsService: LogicsService

  ) {
    
    // this.yesteday = moment().add(-4,'day').set({hour:0,minute:0,second:0,millisecond:0}).format("YYYY-MM-DD HH:mm");
    // this.current_date = moment(this.current_date).format("DD-MM-YYYYHH:mm");
    //this.tomorrow = moment().add(4,'day').set({hour:23,minute:59,second:59,millisecond:0}).format("YYYY-MM-DD HH:mm");
    
    this.year = moment().format('Y');
    this.start_date = moment().add(-8,'day').set({hour:0,minute:0,second:0,millisecond:0}).format();
    this.end_date = moment().add(8,'day').set({hour:23,minute:59,second:59,millisecond:0}).format();
    
    this.form = new FormGroup({
      startDate: new FormControl(this.start_date),
      endDate: new FormControl(this.end_date),
    });
    // this.iView = true;
    // this.listaDisponible = [];
    // this.listaOcupados = [];
    this.refresh();
     // this.createGantt();
  }

  async createGantt(){

    console.log('create gantt');
    this.settings1 = {
      locale: 'es',
      timeLine: 'hours',
      projectName: 'ocupación Hoy',
      taskName: 'Equipos',
      displayDate: 'dddd DD MMMM YYYY',
      dateActive: moment().format(),
      barColor: "#053b74",
    }
    
    this.settings2 = {
      locale: 'es',
      timeLine: 'days',
      projectName: 'ocupación semanal',
      taskName: 'Equipos',
      endDate: this.form.value.endDate,
      startDate: this.form.value.startDate,
      displayDate: 'dddd DD MMMM YYYY',
      dateActive: moment().add(1, 'day').format(),
      barColor: "#053b74",
    }
    console.log('createGantt',  this.settings2);
  }

  public dataBound(): void {
    // this.ganttObj.zoomingLevels = this.customZoomingLevels
  }


  ngOnInit() {

    

    // this.static_form = this.form;
    // this.createGantt();
    // this.refresh();
  }

  activeItem(event) {
    /* console.log(event.target.id)
    if (!event.target.classList.contains('active')) {
      event.target.classList.add('active');
    } else {
      event.target.classList.remove('active');

    } */
  }

  logStatus() {
    // this.cargarDisponibilidad(this.fechaInicio)
  }


  gridRowClicked(event) {
   /*  console.log(event); */
  }

  changeView(numView) {
    /* switch (numView) {
      case 1:
        this.iView = true;
        break;

      case 2:
        this.iView = false;
        break;
    } */

  }

  onSelect(event){

  }



refresh() {
    this.isLoading = true;
    console.log('getAvailability');
    console.log('form', this.form.value)
    if(this.form != undefined){
      // this.start_date =  this.form.value.startDate;
      // this.end_date = this.form.value.endDate;
      /* this.start_date =  this.form.value.startDate;
      this.end_date=  this.form.value.endDate */;
      console.log('settings2', this.settings2);
      let params = {
        startDate: moment(this.form.value.startDate).format(),
        endDate: moment(this.form.value.endDate).format()
      }
      console.log('params', params)
      this.logicsService.getDisponibilidadFilter(params).subscribe((response) => {
       // this.data = <Object[]>response;
        console.log("Disponibilidad", response)
        this.data = response;
        this.createGantt();
        this.isLoading = false;
      })
    }
  }
}
