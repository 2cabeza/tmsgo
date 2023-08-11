import { Component, ElementRef, OnInit, SimpleChanges, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { MapComponent } from 'src/app/components/framework/map/map.component';
import { AppFile, Subsidiary, _LatLng } from 'src/app/models/models';
import { Utils } from 'src/app/utils/utils';
import { Component as _Component, File as _File, Location, StatusForm, Workflow } from '../models/model';
import { ApisService } from '../services/apis.service';
import * as _ from 'lodash';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit, OnDestroy {
  @ViewChild('map', { static: false }) map: MapComponent;
  // @ViewChild('subsidiary_path',  {static: false}) subsidiary_path: SearchComponent;
  // @ViewChild('subsidiary',  {static: false}) subsidiary: SearchComponent;
  // @ViewChild('location',  {static: false}) location: SearchComponent;
  // @ViewChild('type',  {static: false}) type: SearchComponent;

  isLoading = false;
  title = 'Componentes';
  reset = false;
  sessionWorkflows: string;
  sessionForm: string;
  sessionSubsidiary: string;
  sessionSubsidiary2: string;
  sessionLocation: string;
  btnScan = '<requiere_scann/>';

  disabledSubsidiary2 = true;
  disabledLocation = true;

  clearMap = false;
  defaultData = null;
  many = false;
  manyFile = false;
  submitType = 'self';

  latitude: number;
  longitude: number;
  coordinates: string;
  files: AppFile[];

  component: _Component = new _Component();
  temps_files: [];
  subsidiaries_path: any[];

  warning: string;

  // upload
  destroy$: Subject<null> = new Subject();
  fileToUpload: File;
  kittyImagePreview: string | ArrayBuffer;
  // pictureForm: FormGroup;
  submitted = false;
  uploadProgress$: Observable<number>;

  // state
  form: FormGroup;
  formState = 'disabled';
  formVisible = false;
  formEdit = false;
  formScanning = false;
  collapse = 'on';
  collapse_qr = 'off';
  worwflowStatus = [];
  formButtons = false;
  // filters
  filterPath: any;
  filterSubsidiary: any;
  filterLocation: any;
  filterType: any;

  // excludes
  excludePath: any;
  excludeSubsidiary: any;
  excludeLocation: any;
  excludeType: any;

  // ticket field
  ticket = false;
  tickerCol = 4;

  // patch value nc
  componentNc: _Component;
  isNew = true;

  // queries
  selectedQuerySubsidiaryPath: any;

  /**
   * Blur
   * @param eventName 'focusout' is the key
   * @param arguments of type '$event'
   */
  @HostListener('focusout', ['$event'])
  onFocusout(event: any) {
    console.log('focusup', event);
    try {
      if (event.srcElement?.name === 'code_1') {
        if (this.formScanning && this.form.controls.code_1.value != '') {
          const param = {
            'code_1': this.form.controls.code_1.value,
            'search_text': 0
          };
          console.log('param nc', param);
          this.getComponents(param, 'code_1');
        } else {
          console.log('event but empty')
        }
      }
    } catch (error) {
      console.log(error);
    }

    console.log('focusup2', event);
    try {
      if (event.srcElement?.name === 'qr_code' && this.form.controls.qr_code.value != '') {
        if (!this.component?.id) {
          const param = { 'qr_code': this.form.value.qr_code };
          this.getComponents(param, 'qr_code');

        }
      }
    } catch (error) {
      console.log(error);
    }


  }

  constructor(public modalController: ModalController,
    private api: ApisService,
    private navController: NavController,
    public toastController: ToastController,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public loader: LoadingController,
    private readonly storageService: StorageService,
    public util: Utils) {
    this.sessionWorkflows = util.getNumber();
    this.sessionForm = util.getNumber();
    this.initForm();
  }

  ngOnInit() {

    console.log('ngOnInit');
    this.route.queryParams.subscribe(params => {
      const id: any = this.route.snapshot.paramMap.get('id');
      console.log('PARAMS', id, params);
      let path = 'component/forms/';
      if (id) {
        path += id;
        this.isNew = false;
      }
      console.log('PATH', path);
      // tslint:disable-next-line:no-string-literal
      if (params['session']) {
        console.log('tiene  session');
      } else {
        console.log('no tiene  session');
        const navigationExtras: NavigationExtras = {
          queryParams: {
            session: this.util.getNumber()
          }
        };
        this.navController.navigateRoot([path], navigationExtras);
      }

    });
  }

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change', changes);
  }

  init() {
    console.log('#### INIT ####');
    this.resetForm(true);
    this.filterPath = { 'parent_subsidiary': null };
    this.filterType = { 'type_parent': { 'code': 'INV' } };
    let id: any = this.route.snapshot.paramMap.get("id");
    if (id) {
      if (String(id).search('new') == 0) {
        // not found "new"
        this.resetForm(true);
        this.permissions();
        if (id == 'new') {
          this.ticket = true;
          this.excludePath = { 'name': '-escondida' }
        } else {
          this.excludePath = { 'name': 'escondida' }
        }
      } else {
        //# is id
        try {
          this.resetForm();
          this.getComponent(
            Number(this.route.snapshot.paramMap.get("id"))
          );
        } catch (e) { }
      }
    } else {
      this.permissions();
    }
  }

  permissions(DATA = '') {
    console.log('DATA PERMISSSION', DATA)
    if (this.authenticationService.is_group('mel')) {
      this.setStateForm('visible');
    }

    if (this.authenticationService.is_group('venta')) {
      this.setStateForm('visible');
    }

    if (this.authenticationService.is_group('inventariador')) {
      this.setStateForm('editable');
      // let processed = this.workflowFilter({ 'processed': true });

      // if (this.component.qr_code != null && this.component.qr_code !== ''){
      //   this.formScanning = false;
      // }
      // if(processed){
      //   this.formScanning = false;
      // }else{
      //   this.formScanning = true;
      // }
      // this.collapse_qr = 'on';
      // if(processed){
      //   this.setStateForm('visible');
      //   this.formScanning = true;
      //   this.collapse_qr = 'on';
      // }else{
      //   this.setStateForm('editable');
      //   this.formScanning = false;
      //   this.collapse_qr = 'off';
      // }
      // only new register


      // this.formButtons = true;

    }

    

    // this.setStateForm('editable');
    // this.formButtons = true;
    console.log(this.component, this.component)
    if (this.component) {
      this.collapse_qr = 'on';
      if (this.component?.processed) {
        this.setStateForm('visible');
        // this.formEdit = true;
      }
    }

    if (this.authenticationService.is_group('admin')) {
      this.setStateForm('editable');
    }

    
    console.log('PERMISSION END');
    console.log('this.component', this.component?.processed);
    console.log('this.formVisible', this.formVisible);
    console.log('this.formEdit', this.formEdit);
    console.log('this.collapse', this.collapse);
    console.log('this.formScanning', this.formScanning);
    console.log('this.collapse_qr', this.collapse_qr);
    console.log('·························')

  }


  setStateForm(state: string) {

    if (state === 'visible') {
      this.formVisible = true;
      this.formEdit = false;
      this.collapse = 'off';
      this.formButtons = false;
      this.formScanning = false;
      // form reactive disabled
    }
    if (state === 'editable') {
      this.formVisible = true;
      this.formEdit = true;
      this.collapse = 'on';
      this.formButtons = true;
      this.formScanning = true;
    }
    if (state === 'hidden') {
      this.formVisible = false;
      this.formEdit = false;
      this.collapse = 'off';
      this.formButtons = false;
      this.formScanning = false;
      // form reactive disabled
    }
    return state;
  }

  workflowFilter(filter = {}, many = false) {
    if (this.component) {
      if (this.component.workflow) {
        let result = null;
        if (many) {
          result = _.filter(this.component.workflow, filter);
        } else {
          result = _.find(this.component.workflow, filter);
        }
        return result;
      }
    }
    return null;
  }

  workflowEvent(item: StatusForm) {
    console.log('status', item);
    if (item) {
      if (item.state) {
        this.startLoader(item.message);
      } else {
        this.util.presentToast('Proceso guardado.');
        this.loader.dismiss();
        this.navController.navigateRoot(['component/']);
      }
    }
  }

  onUploadLoading(event: boolean) {
    if (event) {
      this.startLoader("Cargando archivo...");
    } else {
      this.loader.dismiss();
    }
  }

  onUploadEvent(item: AppFile) {
    console.log('status', item);
    if (item) {
      this.files.push(item);
    }
    console.log('files', this.files);
  }

  removeFile(item: AppFile) {
    _.remove(this.files, function (n: AppFile) {
      console.log('remove', n.name, item.name);
      return n.name == item.name;
    });

    console.log(this.files);
  }

  resetQr() {
    this.form.controls.qr_code.setValue(null);
  }

  initForm() {
    // reactive form
    this.form = new FormGroup({
      create_type: new FormControl('subsidiary'),
      subsidiary: new FormControl(),
      subsidiary2: new FormControl(),
      code_1: new FormControl(''),
      code_2: new FormControl(''),
      qr_code: new FormControl(''),
      ticket: new FormControl(''),
      height: new FormControl(0),
      width: new FormControl(0),
      long: new FormControl(0),
      weight: new FormControl(0),
      quantity: new FormControl(0, [Validators.required, Validators.min(1), Validators.minLength(1)]),
      longitude: new FormControl(),
      latitude: new FormControl(),
      location: new FormControl(),
      type: new FormControl(),
      description: new FormControl(''),
      observation: new FormControl(''),
      processed: new FormControl(false),
      new_contract: new FormControl(false)
    });

    this.form.controls.qr_code.valueChanges.subscribe(() => {
      this.warning = '';
    });
  }

  onSubmit(event: any = null, validation = false) {
    console.log('validation!!!!', validation);
    if (this.formScanning && this.isNew) {
      const param = { qr_code: this.form.value.qr_code };
      this.getComponents(param, 'qr_code');
      return true;
    }
    console.log('event', event);
    this.submitType = (event) ? event : this.submitType;
    if (!this.ticket) {
      this.form.controls.create_type.setValue('mel');
    }
    const formDeep = _.cloneDeep(this.form.value);
    const merge = _.merge(this.component, formDeep);
    this.component = Object.assign(new _Component(), merge);
    this.component.files = Object.assign([new _File()], this.files);
    console.log('component', this.component);

    console.log('this.component.objectExport()', this.component.objectExport());

    if (this.component.id) {
      console.log('update')
      console.log('component.id', this.component.id);
      this.putComponent(this.component.id, this.component.objectExport());
    } else {
      console.log('post')
      this.postComponent(this.component.objectExport());
    }
  }

  onSelectPath(event: Subsidiary) {
    console.log('onSelectPath', event)

    this.sessionSubsidiary2 = this.util.getNumber();
    this.sessionLocation = this.util.getNumber();
    this.disabledSubsidiary2 = true;
    this.disabledLocation = true;
    this.form.controls.subsidiary2.setValue(event)

    if (event) {
      this.disabledSubsidiary2 = false;
      this.filterSubsidiary = { 'parent_subsidiary': { 'id': event.id } };
    }
  }

  onSelectSubsidiary(event: Subsidiary) {
    console.log('onSelectSubsidiary');
    this.sessionLocation = this.util.getNumber();
    this.disabledLocation = true;

    if (event) {
      this.disabledLocation = false;
      // this.filterLocation = {'subsidiary': event.id};
      this.filterLocation = { 'subsidiary': { 'id': event.id } };
      console.log('filter para location', this.filterLocation);
    }
  }

  onSelectLocation(item: any) {
    if (item) {
      const location: Location = item as Location;
      if (location.latitude && location.longitude) {
        this.form.controls.longitude.setValue(location.longitude);
        this.form.controls.latitude.setValue(location.latitude);
        this.setMarker(location);
      } else {
        
        this.clearContextMap();
      }
    } else {
      this.clearContextMap();
    }
  }

  setMarker(location: _LatLng) {
    this.map.setMarkerPosition(location.latitude, location.longitude);
    this.coordinatesText(location.latitude, location.longitude);
  }

  clearContextMap() {
    this.coordinates = '';
    this.form.controls.longitude.setValue(null);
    this.form.controls.latitude.setValue(null);
    this.map.clearMarker();
  }

  updateLocation(location: _LatLng) {
    if (location) {
      console.log('original ll', location);
      const lat = parseFloat(location.latitude.toString()).toFixed(4);
      const lng = parseFloat(location.longitude.toString()).toFixed(4);
      console.log('new loc', lat, lng);
      this.form.controls.latitude.setValue(lat);
      this.form.controls.longitude.setValue(lng);
      this.coordinatesText(location.latitude, location.longitude);
      // this.setMarker(location);
    }
  }

  coordinatesText(lat: any, lng: any) {
    console.log('coordinatesText', lat, lng);
    try {
      this.coordinates = 'Lat ' + String(lat).substring(0, 7) +
        ',  Lng ' +
        String(lng).substring(0, 7);
    } catch (e) {
      console.log('error_', e);
    }
  }

  resetMap() {
    this.map.initMap();
    this.map.clearMarker();
  }

  wea() {
    console.log('files', this.files);
  }

  resetForm(isFull: boolean = false) {
    this.destroy$.next(null);
    this.form.reset();
    this.files = [];
    this.initForm();
    this.clearContextMap();
    this.sessionForm = this.util.getNumber();
    this.sessionSubsidiary = this.util.getNumber();
    this.sessionSubsidiary2 = this.util.getNumber();
    this.sessionLocation = this.util.getNumber();
    this.disabledSubsidiary2 = true;
    this.disabledLocation = true;
    this.map.initMap();
    this.filterPath = { 'parent_subsidiary': null };
    if (isFull) {
      this.sessionWorkflows = this.util.getNumber();
    }
  }

  patchValues() {

    if (this.component) {

      this.form.patchValue(this.component);
      console.log('patchValue', this.form.value);
      // initial subsidiary path
      if (this.component.subsidiary) {
        this.onSelectSubsidiary(this.component.subsidiary);
        this.onSelectLocation(this.component.location);
      }
      if (this.component.subsidiary2) {
        this.subsidiaries_path = [this.component.subsidiary2];
        this.onSelectPath(this.component.subsidiary2);
      }
      // set data to the map
      if (this.component.latitude && this.component.longitude) {
        let location = new _LatLng();
        location.latitude = this.component.latitude;
        location.longitude = this.component.longitude;
        console.log('loation get', location);
        this.coordinatesText(this.component.latitude, this.component.longitude);
        this.longitude = this.component.longitude;
        this.latitude = this.component.latitude;
        this.setMarker(location);
      }
      // set upload component files
      if (this.component.files) {
        this.files = this.component.files;
      }


    }
  }

  async startLoader(message: string = '') {
    message = (message) ? message : 'Cargando...';
    const loading = await this.loader.create({
      spinner: 'crescent',
      message,
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed with role:', role);
  }

  // services
  getComponents(params: any = null, type: string = null) {

    this.api.getComponents(params).subscribe(
      (response) => {
        if (type === 'qr_code') {
          console.log('COMPONENT QR', response);
          const components = response as Component[];
          if (components?.length > 0) {
            this.warning = 'El código QR ya se encuentra asociado a otro registro.';
            this.util.presentToast(this.warning);
          } else {
            this.warning = '';
            this.formScanning = false;
            this.onSubmit();
          }
        }
        if (type === 'code_1') {
          try {
            console.log('COMPONENT 1', response);
            const componentsNc = response as _Component[];
            if (componentsNc.length > 0) {
              this.componentNc = componentsNc[0];
              console.log('COMPONENT 1', this.componentNc);
              this.form.controls.height.setValue(this.componentNc.height);
              this.form.controls.width.setValue(this.componentNc.width);
              this.form.controls.long.setValue(this.componentNc.long);
              this.form.controls.weight.setValue(this.componentNc.weight);
              this.form.controls.description.setValue(this.componentNc.description);
              this.form.controls.observation.setValue(this.componentNc.observation);
            }
          } catch (error) {
            console.log(error);
          }
        }
      },
      error => {
        console.log('error', error);
        // this.warning = 'Existe un error al guardar el registro. Informar al administrador.';
        // this.warning = JSON.stringify(error.error);
        // this.loader.dismiss();
      });
  }

  // services
  getComponent(id: any) {
    this.api.getComponent(id).subscribe(
      (response) => {
        console.log('COMPONENT', response);
        this.component = Object.assign(new _Component(), response);
        this.patchValues();
        this.permissions('SHAAAAA');
      },
      error => {
        console.log('error', error);
        this.warning = JSON.stringify(error.error);
        this.loader.dismiss();
      });
  }

  /** Post Component */
  postComponent(data: any) {
    this.api.postComponent(data).subscribe(
      (response) => {
        console.log('response', response);
        // this.postFiles(response);
        this.component = (response as _Component);
        this.util.presentToast('Inventario ' + this.component.id + ' creado.');
        this.goTo();
      },
      error => {
        this.warning = JSON.stringify(error.error);
      });
  }

  /** Put Component */
  putComponent(id: any, data: any) {
    this.api.putComponent(id, data).subscribe(
      (response) => {
        console.log('response', response);
        // this.postFiles(response);
        this.component = (response as _Component);
        this.util.presentToast('Inventario ' + this.component.id + ' guardado.');
        this.goTo();
      },
      error => {
        this.warning = JSON.stringify(error.error);
      });
  }

  goTo() {
    this.resetForm(true);
    if (this.submitType === 'new') {
      this.navController.navigateRoot(['component/forms/new']);
      this.init();
    } else if (this.submitType === 'self') {
      this.navController.navigateRoot(['component/forms/' + this.component.id]);
      this.init();
    } else {
      this.navController.navigateRoot(['component/']);
    }
  }

  /** Post Images */
  postFiles(component: any) {
    if (this.files) {
      for (let img of this.files) {
        let param = {}
        if (component) {
          param['component'] = component.id;
          param['name'] = img.name;
          param['value'] = img.value;
          this.api.postFile(param).subscribe((response) => {
            console.log('IMG', response);
          });
        }
      }
    }
  }

  view(item: any) {
    this.util.mediaViewer(item);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.destroy$.next(null);
  }


}
