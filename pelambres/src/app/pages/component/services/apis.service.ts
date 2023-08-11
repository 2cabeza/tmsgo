import { Injectable } from '@angular/core';
import { LogicsService } from 'src/app/services/logics.service';
import { inherits } from 'util';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  urlBase = environment.urlBase;

  constructor(private http: HttpClient) { }

  getComponents(params: any = {}): Observable<any> {
    
    const path = this.urlBase + 'app_component/api/component/' ;
    console.log('path', path);
    return this.http.get(path, {params: params});
  }

  getComponent(id:any): Observable<any> {
    
    const path = this.urlBase + 'app_component/api/component/' + id + '/';
    console.log('path', path);
    return this.http.get(path);
  }

  putComponent(id:any, params:any): Observable<any> {
    
    const path = this.urlBase + 'app_component/api/component/' + id + '/';
    console.log('path', path);
    return this.http.put(path, params);
  }

  postComponent(params:any) {
    console.log(params);
    return this.http.post(this.urlBase + 'app_component/api/component/', params);
  }

  postComponentLocation(params:any) {
    console.log(params);
    return this.http.post(this.urlBase + 'app_component/api/component_location/', params);
  }

  postFile(params:any) {
    console.log(params);
    return this.http.post(this.urlBase + 'app_component/api/file/', params);
  }

  putWorkflow(id:any, params:any): Observable<any> {
    
    const path = this.urlBase + 'app_component/api/workflow/' + id + '/';
    console.log('path', path);
    return this.http.put(path, params);
  }

}
