import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogicsService {

  urlBase = environment.urlBase;
  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAuthToken() {

    const httpOptions = {
      headers: new HttpHeaders({
        //   'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': `token ${this.authService.getToken()}`,
      })
    };
    return httpOptions;
  }

  loginUser(params) {
    console.log('PATH', this.urlBase)
    return this.http.post(this.urlBase + 'app_general/api/api-token-auth/', params);
  }

  getSubsidiaries(params: any = null) {
    return this.http.get(this.urlBase + 'app_general/api/subsidiary/');
  }

  getProviders(params: any = null) {
    return this.http.get(this.urlBase + 'app_general/api/provider/', {params: params});
  }

  getLocation(params: any = null) {
    return this.http.get(this.urlBase + 'app_component/api/location/', 
                          {params: params}
                          );
  }

  getType(params: any = null) {
    return this.http.get(this.urlBase + 'app_component/api/type/', 
                          {params: params}
                          );
  }

  getDisponibilidad(date) {
    let fechaServicio
    if (date) {
      fechaServicio = moment(date).format("YYYY-MM-DD")

    } else {
      fechaServicio = moment().format("YYYY-MM-DD")

    }
    return this.http.get(this.urlBase + 'app_transport_services/api/availability/?service_date=' + fechaServicio);
  }

  getServicesFilter(params: any = {}): Observable<any> {
    
    const path = this.urlBase + 'app_transport_services/api/service_order/' ;
    console.log('path', path);
    return this.http.get(path, {params: params});
  }

  getServicesId(id) {

    return this.http.get(this.urlBase + 'app_transport_services/api/service_order/' + id + '/');
  }

  getEquipmentList(): Observable<any>{

    return this.http.get(this.urlBase + 'app_transport_services/api/equipment/');
  }

  getDriverList(): Observable<any>{

    return this.http.get(this.urlBase + 'app_transport_services/api/driver/');
  }

  getContractList() {

    return this.http.get(this.urlBase + 'app_transport_services/api/contract/');
  }

  getServiceOrderTypeList() {

    return this.http.get(this.urlBase + 'app_transport_services/api/service_order_type/');
  }

  getCenterCost(): Observable<any> {

    return this.http.get(this.urlBase + 'app_transport_services/api/cost_center/');
  }

  postServiceForm(params) {
    console.log(params);
    return this.http.post(this.urlBase + 'app_transport_services/api/service_order/', params);
  }

  postWorkLog(params) {
    return this.http.post(this.urlBase + 'app_transport_services/api/work_log/', params);
  }

  postServiceCost(params: any) {
    return this.http.post(this.urlBase + 'app_transport_services/api/service_cost/', params);
  }

  getDisponibilidadFilter(params): Observable<any>  {

    console.log(params)
    let query = this.urlBase + 'app_transport_services/api/availability/?start_date=' + params.startDate + '&end_date=' + params.endDate;

    return this.http.get(query
    ).pipe(
      map((response: Response) => <any>response)
    );
  }

  getCostType(): Observable<any> {

    return this.http.get(this.urlBase + 'app_transport_services/api/cost_type/');
  }

  getListMenu(): Observable<any>  {

    let query = this.urlBase + 'app_application/api/list/?code=' + environment.menu;

    return this.http.get(query
    ).pipe(
      map((response: Response) => <any>response)
    );
  }

  getApplication(): Observable<any>  {
    
    let query = this.urlBase + 'app_application/api/application/' + environment.app + '/';

    return this.http.get(query
    ).pipe(
      map((response: Response) => <any>response)
    );
  }

  getStatistics(): Observable<any> {

    return this.http.get(this.urlBase + 'app_transport_services/api/statistics/');
  }

  setPaginator(){

  }

  getService(endPoint:string = null, params={}): Observable<any>  {
    if(endPoint){
      let query = this.urlBase + endPoint;

      return this.http.get(query, {params: params}
      ).pipe(
        map((response: Response) => <any>response)
      );
    }else{
      return null
    }
  }

  postService(endPoint:string = null, params={}): Observable<any>  {
    if(endPoint){
      let query = this.urlBase + endPoint;

      return this.http.post(query, params
      ).pipe(
        map((response: Response) => <any>response)
      );
    }else{
      return null
    }
  }

}
