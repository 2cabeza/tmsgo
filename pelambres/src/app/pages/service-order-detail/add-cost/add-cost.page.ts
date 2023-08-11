import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CostType, ServiceCost, ServiceCostInput, ServiceOrder } from 'src/app/models/models';
import { LogicsService } from 'src/app/services/logics.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-add-cost',
  templateUrl: './add-cost.page.html',
  styleUrls: ['./add-cost.page.scss'],
})
export class AddCostPage implements OnInit {

  @Input() modal: ModalController;
  @Input() item: ServiceOrder;
  @Input() windowType: any;
  
  form: FormGroup;
  costtypes: CostType[];
  equipmentMany = false;
  reset = false;

  constructor(private logicsService: LogicsService, private util: Utils) { 
    this.loadCostType();
  }

  ngOnInit() {
    console.log('item init', this.item);
    let validator: any;
    if(!this.item){
      validator = [Validators.required, Validators.min(1)];
    }
    this.form = new FormGroup({
      cost_type: new FormControl(-1,[Validators.required, Validators.min(1)]),
      value1: new FormControl(0),
      value2: new FormControl(0),
      image: new FormControl(),
      equipments: new FormControl(-1, validator),
      observation: new FormControl('')
    });
  }

  onSubmit(){
    if (this.form.valid) {
      console.log('this.form.value', this.form.value);
      let form = this.form.value;
      let service_cost:ServiceCostInput = new ServiceCostInput();
      service_cost.cost_type = form.cost_type.id;
      service_cost.value1 = form.value1;
      service_cost.value2 = form.value2;
      service_cost.observation = form.observation;
      service_cost.image = form.image;
      console.log('this.item', this.item);
      if (this.item) {
        service_cost.service_order = this.item.id;
      }
      if (form.equipments) {
        service_cost.equipment = form.equipments.id;
      }
      console.log('service cost input', service_cost);
      this.logicsService.postServiceCost(service_cost).subscribe((response) => {
        console.log('response', response);
        if (this.item) {
          if (this.item.service_costs) {
            this.item.service_costs.push(<ServiceCost>response);
          }else{
            this.item.service_costs = [<ServiceCost>response];
          }
        }
        this.resetForm();
        this.util.presentToast("Rendición agregada.");
        this.dismiss();
      });
    }else{
      this.util.presentToast("Faltan campos necesarios.");
    }

  }

  //reset form
  resetForm(){
    this.reset = true;
    this.form.reset();
  }

  // select text
  _event(event: any){
    let input: HTMLInputElement = event.target;
    if(input.type == 'number' && input.value == "0"){
      input.select();
    }
  }

  dismiss(status: boolean = false) {
    this.modal.dismiss({
      'dismissed': true,
      'changes': status,
    });
  }

  // get cost type
  loadCostType() {
    this.logicsService.getCostType().subscribe((response) => {
      this.costtypes = response;
      console.log('this.costtypes', this.costtypes);
    })
  }

  
}
