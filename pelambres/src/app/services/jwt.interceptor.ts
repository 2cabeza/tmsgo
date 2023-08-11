import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token = null
    try{
      const info = JSON.parse(localStorage.getItem('USER_INFO'));
      if(info){
        token = info.token
      }
    }catch(ex){
      console.log('sin token en storage')
    }
    
    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Token ' + token)
      });
    }
    console.log('request', request)
    return next.handle(request);
  }
}
