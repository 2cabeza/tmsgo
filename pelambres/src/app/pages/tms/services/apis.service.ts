import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  urlBase = environment.urlBase;

  constructor(private http: HttpClient) { }

  getTracking(params: any = {}): Observable<any> {
    
    const path = this.urlBase + 'app_transport_services/api/tracking/' ;
    console.log('path', path);
    return this.http.get(path, {params: params});
  }
}
