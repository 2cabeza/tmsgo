import { ChangeDetectionStrategy, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
// import { ColumnMode } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { Utils } from 'src/app/utils/utils';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable/';
import { ApisService } from './services/apis.service';
import { Component as _Component } from './models/model';
import * as _ from 'lodash';
import { MediaViewerComponent } from 'src/app/components/media-viewer/media-viewer.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SafePipe } from 'src/app/pipes/safe.pipe';


@Component({
  selector: 'app-component',
  templateUrl: './component.page.html',
  styleUrls: ['./component.page.scss']
})
@Injectable({ providedIn: 'root' })
export class ComponentPage implements OnInit {

  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 10;
  rows: any[] = null;
  dataLive: any[] = [];
  // columns = [{ name: 'Files', sortable: false }];

  isLoading: boolean;
  sortable = false;

  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  tableStyle = 'bootstrap';
  customRowClass = false;
  urlBase = environment.urlBase + 'app_component/api/download_file/'
  linkExport: string = this.urlBase;

  form: FormGroup;

  public fields: Object = { value: "Name" };
  public text: string = "Buscar";
  public highlight: Boolean = true;

  public start_date: any;
  public end_date: any;
  subsidiaries: any[] = [];
  customPickerOptions: any = "";
  cancelText = "Cancelar";
  doneText = "Confirmar";
  year: any = '';

  components: _Component[];

  // filters
  filterPath: any;

  // pagination
  limit = 20
  offset = 0
  count = 0

  // table 2
  data!: any;
  columns: string[] = ['id', 'subsidiarypath', 'state1', 'state2', 'new_contract', 'public', 'state3', 'created', 'modified', 'quantity', 'cantmel', 'description', 'subsidiary', 'location', 'code1', 'code2', 'qrcode', 'type', 'weight', 'long', 'width', 'height'];
  columnsName: string[] = ['Id', 'Sucursal', 'Estado MEL', 'Estado Venta', 'Nuevo Contrato', 'Publicado Venta', 'Procesada Romanero', 'Creada', 'Modificada', 'Cantidad', 'Cantidad MEL', 'Descripción', 'Patio', 'Ubicación', 'Código SAP', 'NP', 'Código QR', 'Tipo', 'Peso', 'Largo', 'Ancho', 'Alto'];

  // table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  // @Input() data!: any[];
  dataSource!: MatTableDataSource<any>;
  // @Input() columns!: any[];
  // @Input() columnsName!: any[];
  // @Input() title!: any;

  selectedRowIndex = -1;

  firstElement = true;

  constructor(public modalController: ModalController,
    public toastController: ToastController,
    public util: Utils,
    private api: ApisService,
    public keyboard: Keyboard,
    private router: Router,
    protected sanitizer: DomSanitizer,
    private el: ElementRef) {
    this.initForm();
    this.year = moment().format('Y');
  }

  ngOnInit() {
    console.log('ngOnInit component list');
    // this.columns = [{ name: 'Id' }, { name: 'Created' }, { prop: "Code_1", name: "Code 1" }];
    this.getData();
    this.filterPath = { 'parent_subsidiary': null };
    this.initForm();
    // this.setData()
  }

  // table funtions
  setData() {
    this.dataSource = new MatTableDataSource(this.rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selectItem(row: any) {
    // this.item = row;
    console.log('row', row);
    // this.resetForm();
    // this.selectedRowIndex = row.id;
    // this.recipe = row.item;
    // this.router.navigate(['quotation'], { queryParams: { recipe: row.id} });
  }

  onSubmit() {

  }

  download() {
    console.log('download');
  }

  getData() {
    console.log('get data')
    this.resetInit();
    this.getComponents();
  }

  resetInit() {
    this.limit = 20
    this.offset = 0
    this.count = 0
    this.dataLive = [];
    this.rows = [];
  }

  onSelectPath(event: any) {
    console.log('sucursal', event);
    this.subsidiaries = [];
    if (event) {
      for (let s of event) {
        this.subsidiaries.push(s.id)
      }
      console.log(this.subsidiaries);
    }
  }

  ionViewWillEnter() {
    // this.getData();
  }

  goDetail(item: any) {
    console.log('item', item);
    this.router.navigate(['component/forms/' + item.id]);

    // component/forms/{{element[column]}}
  }

  initForm() {
    // reactive form
    this.form = new FormGroup({
      search: new FormControl(),
      start_date: new FormControl(moment().subtract(29, 'days')),
      end_date: new FormControl(moment()),
      new_contract: new FormControl(false)
    });
    //  this.form.valueChanges.subscribe(() => {
    //     console.log('detecta algo');
    //     let params = new HttpParams();
    //     params = params.append('search', this.form.controls.search.value);
    //     this.linkExport = this.urlBase + '?' + params;
    //   })

  }

  // onSelect({ selected }) {
  //   console.log('Select Event', selected, this.selected);
  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(...selected);
  // }




  // private loadPage(limit: number) {
  //   console.log('loadPage', limit);

  //   // set the loading flag, which serves two purposes:
  //   // 1) it prevents the same page from being loaded twice
  //   // 2) it enables display of the loading indicator
  //   this.isLoading = true;

  //   // this.serverResultsService.getResults(this.rows.length, limit).subscribe(results => {
  //   //   const rows = [...this.rows, ...results.data];
  //   //   this.rows = rows;
  //   //   console.log('rowsx', this.rows);
  //   //   this.isLoading = false;
  //   // });

  // }


  // services
  getComponents(clearData=true) {
    // this.rows = [];
    if(clearData){
      this.rows = [];
      this.dataLive = [];
      this.setData();
    }
    this.isLoading = true;
    let param = {};
    let onlyDate = true;
    param = { 'limit': this.limit, 'offset': this.offset, 'ordering': '-created' }

    if (this.form.controls.search.value != null) {
      param['search'] = this.form.controls.search.value;
      onlyDate = false;
    }
    if (this.subsidiaries) {
      if (this.subsidiaries.length > 0) {
        param['subsidiaries'] = this.subsidiaries.join(',');
        onlyDate = false
      }
    }

    if (this.form.controls.new_contract.value) {
      param['new_contract'] = this.form.controls.new_contract.value;
      onlyDate = false;
    }

    if (onlyDate) {
      if (this.form.controls.start_date.value != null) {
        param['start_date'] = moment(this.form.controls.start_date.value).format('YYYY-MM-DD');
      }
      if (this.form.controls.end_date.value != null) {
        param['end_date'] = moment(this.form.controls.end_date.value).format('YYYY-MM-DD');
      }
    }

    // generate link export
    const params = new HttpParams({ fromObject: param }).toString();
    console.log('PARAMS', params);
    this.linkExport = this.urlBase + '?' + params;
    // get api
    this.api.getComponents(param).subscribe(async response => {
      console.log('response', response);
      let components = Object.assign([new _Component()], response['results']);
      console.log('components', components);
      if (response['results']?.length > 0) {
        // let rows = []
        // this.dataLive = [];
        for (let item of components) {
          let row: _Component = Object.assign(new _Component(), item);
          this.dataLive.push(row.objectTable());
        }
        // this.rows.push(...rows)
        this.rows = this.dataLive;
        this.setData()
        // if (response.count > 0) {
        //   if (this.rows.length < response.count) {
        
        //   } else {
        //     console.log('rows lengh final', this.rows)
            
        //   }
        if(response.next != null){
            this.offset += this.limit
          await this.delay(650);
          this.getComponents(false)
        }
        else {
          this.resetInit();
          this.dataLive = null;
          this.rows = null;
        }
      }else{
        console.log('components menor a 0');
      }
      this.isLoading = false;


    })
  }



  public getCodes(id: any, value = null) {

    let result = '';
    if (id) {
      try {
        let item = _.find(this.rows, function (o) { return o.id == id; });
        if (value) {
          result = item[value];
        }
      } catch (ex) {
        console.log(ex)
      }
    }
    return result;
  }

  // open image
  public async mediaViewer(item: any) {
    if (item) {

      const modal = await this.modalController.create({
        component: MediaViewerComponent,
        swipeToClose: true,
        componentProps: {
          'media': item,
          'type': 'image',
          'icon': 'icon',
          'modal': this
        }
      });

      // close event
      modal.onDidDismiss()
        .then((data) => {

        });
      return await modal.present();

    } else {
      return false;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
