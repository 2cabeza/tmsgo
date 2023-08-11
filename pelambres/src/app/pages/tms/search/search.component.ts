import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'tms-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  customPickerOptions :any = "";
  cancelText = "Cancelar";
  doneText = "Confirmar";
  monthShortNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sept','Oct', 'Nov', 'Dic'];
  year: any = '';

  constructor(public util: Utils) { }

  ngOnInit() {
    this.year = moment().format('Y');
    this.initForm();
  }

  submit(){

  }

  initForm() {
    // reactive form
   this.form = new FormGroup({
     search: new FormControl(),
     start_date: new FormControl(),
     end_date: new FormControl(),
     is_driver: new FormControl(0),
   });
 }

}
