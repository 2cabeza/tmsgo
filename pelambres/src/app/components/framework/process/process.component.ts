import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldList, WorkflowValue } from 'src/app/models/models';
import { LogicsService } from 'src/app/services/logics.service';
import { Utils } from 'src/app/utils/utils';
import * as _ from 'lodash';
import { Field } from 'src/app/pages/component/models/model';

@Component({
  selector: 'go-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
})
export class ProcessComponent implements OnInit, AfterViewInit, AfterViewChecked  {
  @Input() item: WorkflowValue;
  @Input() contextId: number;
  @Input() value: string = 'id';
  @Input() search: [];
  @Input() firstLine: [];
  @Input() secondLine: [];
  @Input() showChipIcon: boolean = false;

  session = null;

  form: FormGroup
  formEdit = true
  existBtn = true
  isModified = false

  objects = new Map<string, []>();

  constructor(public util: Utils, 
              private service: LogicsService,
              ) { 
    this.session = util.getNumber();
  }
  ngAfterViewInit(): void {
    console.log('## ngAfterViewInit ##')
    this.addAttrs();
  }
  ngAfterViewChecked(): void {
    // this.addAttrs();
  }

  ngOnInit() {}


  ngOnChanges(changes: SimpleChanges) {
    // console.log('ngOnChanges Process', changes);
    if (changes['item']) {
      this.initForm();
      
    }
  }

  initForm() {
    // reactive form
    this.form = new FormGroup({
      process: new FormControl(this.item.id),
      context_type: new FormControl(this.contextId),
    });

    // scan fields list and add custom form control
    const form_ = this.form;
    let objects = this.objects;
    _.forEach(this.item.field_list, function (li: any) {
      let value_: any = '';
      // boolean type

      if(li.value){

        if (li.value.toLowerCase() == 'true' || li.value.toLowerCase() == 'false') {
          value_ = (String(li.value).toLowerCase() == "true")
        } else {
          value_ = li.value;
        }
  
        // add element to form group
        if(li.type == "multiselect"){
          value_ = eval(value_);
          objects[li.key] = value_;
        }
  
        if(li.type == "select"){
          objects[li.key] = [JSON.parse(value_)]
        }
      }
      form_.addControl(li.key, new FormControl(value_))
    });

    console.log('value?', this.form.value)
    this.form.valueChanges.subscribe(() => {
      this.isModified = true;
      // console.log('ha habido un cambio', this.form.value)

    });
    // console.log('form', this.form.value)

  }

  addAttrs(){
    var element = document.querySelector('.size-param');
    console.log('html', element);
    
    //this.renderer2.setAttribute(element, 'size', '3');
  }

  /**
   *  Submit event
   */
  onSubmit() {
    const param = _.cloneDeep(this.form.value)
    // param['context_id'] = this.contextId
    // console.log('params', param)
    // requiere post custom service (multiitem)
    _.forEach(param, (item) => {
      try {
        if (item.get('field')?.api_context != '') {
          // set value
          param[item.get('field').key] = item.get('value')
          // get service (post)
          this.postService(item.get('field')?.api_context, param)
        }
      } catch (ex) { }
    });
    // other type
    this.postService('app_general/api/metadata/', param)

  }


  patchValues() {
    this.objects.clear();
    this.form.reset();
    this.session = this.util.getNumber();
    this.initForm();
    this.isModified = false;
  }

  exit() {

  }

  // multi select (scan) event
  onSelect(event: any) {
    // console.log('onSelect', event)
    // multi select / items
    if (event.get('field').type == 'multiselect' 
        || event.get('field').type == 'select'
        ) {
      this.form.controls[event.get('field').key]?.setValue(event);
      // console.log('FORM', this.form.value)
    }
  }


  // event scanner component
  onValueScann(event: any, field: FieldList) {
    // console.log('scan value', event, field)
    if (field.api_list) {
      const param = {
        'qr_code': event
      }
      this.getService(field.api_list, param, field.key)
    }
  }

  //events multifile
  onUploads(event: any, field: FieldList) {
    // console.log('upload value', event, field)
    this.form.controls[field.key].setValue(event);
  }

  // insert service
  postService(endPoint: string = null, params = {}) {
    this.service.postService(endPoint, params).subscribe((response) => {
      // console.log('response', response)
      this.isModified = false;
      this.util.presentToast("Proceso Guardado.");
    });
  }

  /**
   * Get service generic
   * @param endPoint 
   * @param params 
   * @param prefix 
   */
  getService(endPoint: string = null, params = {}, prefix = 'item') {
    this.service.getService(endPoint, params).subscribe((response) => {
      // console.log('response', response, prefix)
      let resp = [];
      resp = response
      if (resp?.length > 0) {
        this.objects[prefix] = response;
      } else {
        this.util.presentToast("Elemento ingresado no se encuentra disponible.");
      }
    });
  }

}
