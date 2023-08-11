import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { LogicsService } from 'src/app/services/logics.service';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'c-gantt',
  templateUrl: './c-gantt.component.html',
  styleUrls: ['./c-gantt.component.scss'],
  //  encapsulation: ViewEncapsulation.None

})
export class CGanttComponent implements OnInit {
  @Input() form: FormGroup;
  // @ViewChild('gantt', { static: true })
  // @ViewChild('gantt', {static: true})

  // @Input() data: any;


  constructor(private logicsService: LogicsService) { 
    
  }

  ngOnInit() {
    // this.getAvailability();
    // // this.data = zoomingData;
    //   this.data = [
    //     {
    //         TaskID: 1,
    //         TaskName: 'Project Initiation',
    //         StartDate: new Date('04/02/2019'),
    //         EndDate: new Date('04/21/2019'),
    //         subtasks: [
    //             {  TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
    //             { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50  },
    //             { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
    //         ]
    //     },
    //     {
    //         TaskID: 5,
    //         TaskName: 'Project Estimation',
    //         StartDate: new Date('04/02/2019'),
    //         EndDate: new Date('04/21/2019'),
    //         subtasks: [
    //             { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
    //             { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
    //             { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
    //         ]
    //     },
    // ];
    // this.taskSettings = {
    //     id: 'TaskID',
    //     name: 'TaskName',
    //     startDate: 'StartDate',
    //     endDate: 'EndDate',
    //     duration: 'Duration',
    //     progress: 'Progress',
    //     dependency: 'Predecessor',
    //     child: 'subtasks'
    // };
    // this.toolbar = ['ZoomIn', 'ZoomOut', 'ZoomToFit'];
    // this.projectStartDate = new Date('03/24/2020');
    // this.projectEndDate = new Date('05/05/2020');
    // this.labelSettings = {
    //     leftLabel: 'TaskName'
    // };
    // this.columns = [
    //     { field: 'TaskID', width: 60 },
    //     { field: 'TaskName', width: 250 },
    //     { field: 'StartDate' },
    //     { field: 'EndDate' },
    //     { field: 'Duration' },
    //     { field: 'Predecessor' },
    //     { field: 'Progress' },
    // ];
    // this.splitterSettings = {
    //     columnIndex: 2
    // };


    
    

    //this.toolbar = ['ZoomIn', 'ZoomOut', 'ZoomToFit'];
    //this.getAvailability();

  }


  public dataBound(): void {
    // this.ganttObj.zoomingLevels = this.customZoomingLevels
  }


  getAvailability() {
    // console.log('getAvailability');
    // this.projectStartDate =  this.form.value.startDate;
    // this.projectEndDate = this.form.value.endDate;

    // if(this.projectStartDate != undefined){
    //   let params = {
    //     startDate: moment(this.projectStartDate).format("YYYY-MM-DD HH:mm"),
    //     endDate: moment(this.projectEndDate).format("YYYY-MM-DD HH:mm")
    //   }
    //   this.logicsService.getDisponibilidadFilter(params).subscribe((response) => {
    //     this.data = <Object[]>response;
    //     console.log("Disponibilidad", response)
    //   })
    // }
  }
  


  loadDisponibilidad(data) {
    // this.cargarDisponibilidad(data);
  }


}
