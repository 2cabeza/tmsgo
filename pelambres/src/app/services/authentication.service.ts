import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { LogicsService } from './logics.service';
import { Application, List } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(true);
  app = new BehaviorSubject(null);
  provider = new BehaviorSubject(null);
  // providers = new BehaviorSubject(null);
  organization = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private platform: Platform,
    public toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      console.log('init')
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    try{
      let user = JSON.parse(localStorage.getItem('USER_INFO'));
      console.log('user', user)
       if (!user) {
        console.log('nok')
        this.authState.next(false);
      }else{
        console.log('Provider?', user.provider);
        this.provider.next(user.provider);
        this.organization.next(user.organization);
      }
    }catch(ex){}
  }

  login(params: any) {
    try{
    localStorage.setItem('USER_INFO', JSON.stringify(params));
    }catch(ex){
      console.log('login', ex)
    }
    this.authState.next(true);
  }

  logout() {
    try{
      localStorage.removeItem('USER_INFO');
    }catch(ex){
      console.log('logout', ex)
    }
    this.authState.next(false);
    this.router.navigate(['login']);
  }

  isAuthenticated() {
    return this.authState.value;
  }

  getUser()
  {
    try{
    let user = JSON.parse(localStorage.getItem('USER_INFO'));
    return user;
    }catch(ex){
      return false
    }
  }

  home()
  {
    try{
      let user = JSON.parse(localStorage.getItem('USER_INFO'));
      return user;
    }catch(ex){
      return false
    }
  }
  
  

  getToken()
  {
    try{
    let user = JSON.parse(localStorage.getItem('USER_INFO'));
      return user.token;
    }catch(ex){
      return false
    }
  }

  is_group(name: string): any{
    try{
      let user =  JSON.parse(localStorage.getItem('USER_INFO'));
      // console.log('user', user);
      let groups: any[] = user.groups.filter(group => {
        return String(group.name).toLowerCase().search(name.toLowerCase())==0;
      })
      console.log('grups', groups);
      let permission = groups.length > 0 ? true: false
      return permission;
    }catch(ex){
      return false
    }
  }

}
