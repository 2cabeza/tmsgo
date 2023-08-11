import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-between-dates',
  templateUrl: './between-dates.component.html',
  styleUrls: ['./between-dates.component.scss'],
})
export class BetweenDatesComponent implements OnInit {

  form: FormGroup;
  customPickerOptions :any = "";
  cancelText = "Cancelar";
  doneText = "Confirmar";
  monthShortNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sept','Oct', 'Nov', 'Dic'];
  year: any = '';
  public start_date: any;
  public end_date: any;

  constructor() { 

    this.year = moment().format('Y');
    this.start_date = moment().add(-8,'day').set({hour:0,minute:0,second:0,millisecond:0}).format();
    this.end_date = moment().add(8,'day').set({hour:23,minute:59,second:59,millisecond:0}).format();
    
    this.form = new FormGroup({
      start_date: new FormControl(),
      end_date: new FormControl(),
    });
    
  }

  ngOnInit() {}

}
