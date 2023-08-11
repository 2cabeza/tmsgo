import { Component, OnInit, Input } from '@angular/core';
import { LogicsService } from 'src/app/services/logics.service';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.page.html',
  styleUrls: ['./registrar-evento.page.scss'],
})
export class RegistrarEventoPage implements OnInit {
  @Input() service: any;
  @Input() modal: ModalController;
  static componentName = 'RegistrarEventoPage';
  public title = 'Registrar evento';
  kmInicial: any;
  kmEvento: any;
  kmFinal: any;

  descripcionEvento: any;
  observacionFinal: any;

  service_active: {};
  modal_obj: any;
  tab_active: string = 'iniciar';
  tab_verb = 'inicio';

  filterActive: any;
  devWidth: any;

  viewInicioServicio: any;
  viewRegistroEvento: any;
  viewCierreServicio: any;

  start_tab_disabled: boolean = false;
  end_tab_disabled: boolean = false;

  isLoading: any;

  constructor(navParams: NavParams, private logicsService: LogicsService, private activatedRoute: ActivatedRoute, public platform: Platform, private navController: NavController) {
    console.log(navParams.get('service'));
    this.service_active = navParams.get('service');
    this.modal_obj = navParams.get('modal');
    this.title += (this.service_active) ? ' - #' + this.service_active['id'] : '';
    this.isLoading = false;

    this.kmInicial = "";
    this.kmEvento = "";
    this.kmFinal = "";
    this.descripcionEvento = ""
    this.observacionFinal = ""
    this.filterActive = false;

    this.viewInicioServicio = true;
    this.viewRegistroEvento = false;
    this.viewCierreServicio = false;

    this.checkStatusWorkLog();
  }

  ngOnInit() {
  }

  checkStatusWorkLog() {
    // start check
    const start = this.service_active['work_logs'].filter((work) => { 
      return work.type.name == 'inicio';
    });
    if(start.length > 0){
      // service started
      this.start_tab_disabled = true;
      let obj_ = start[start.length-1];
      this.kmInicial = obj_["value"];
      this.tab_active = 'finalizar';
    }else{
      // service not started
      this.end_tab_disabled = true;
    }
    console.log('start', start)

    // end check
    const end = this.service_active['work_logs'].filter((work) => { 
      return work.type.name == 'cierre';
    });
    if(end.length > 0){
      // service closed
      this.end_tab_disabled = true;
      let obj_ = end[end.length-1];
      this.kmFinal = obj_["value"];
      this.tab_active = 'reportar';
    }

    this.changeTabsServicio()
  }

  registrarEvento(eventNum) {

    this.isLoading = true;
    let data = {
      service_order: this.service_active['id'],
      type: '',
      value: '',
      description: ''
    }

    switch (eventNum) {
      // inicio
      case 1:
        data.type = "1"
        data.value = this.kmInicial;
        data.description = 'Salida efectiva.'
        break;
      // cierre
      case 2:
        data.type = "2"
        data.value = this.kmFinal;
        data.description = 'Termino del servicio. ' + this.observacionFinal
        break;
      // evento
      case 3:
        data.type = "3"
        data.value = this.kmEvento;
        data.description = this.descripcionEvento;
        break;
    }

    this.logicsService.postWorkLog(data).subscribe((response) => {
      console.log(response);
      if (response['message'] == "OK") {
        // this.toastr.success('Evento Registrado!', '');
        this.isLoading = false;
        this.kmInicial = "";
        this.kmEvento = "";
        this.kmFinal = "";
        this.descripcionEvento = ""
        this.observacionFinal = ""
        this.dismiss(true);
        //this.navController.navigateForward('/detalle-solicitud/' + this.idServicio);
      }
    })
  }

  changeTabsServicio(event: any = null) {
    
    this.tab_active = (event)? event.detail.value : this.tab_active;
    console.log(this.tab_active);

    switch (this.tab_active) {

      case 'iniciar':
        this.tab_verb = 'iniciado';
        this.viewInicioServicio = true;
        this.viewRegistroEvento = false;
        this.viewCierreServicio = false;
        break;

      case 'reportar':
        this.tab_verb = 'reportado';
        this.viewInicioServicio = false;
        this.viewRegistroEvento = true;
        this.viewCierreServicio = false;
        break;

      case 'finalizar':
        this.tab_verb = 'finalizado';
        this.viewInicioServicio = false;
        this.viewRegistroEvento = false;
        this.viewCierreServicio = true;
        break;
    }
  }

  dismiss(status: boolean = false) {
    this.modal_obj.dismiss({
      'dismissed': true,
      'changes': status,
      'action': this.tab_verb,
    });
  }

}
