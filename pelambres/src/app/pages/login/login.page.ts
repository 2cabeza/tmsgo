import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LogicsService } from 'src/app/services/logics.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('myLoginForm') myLoginForm: ElementRef;

  devWidth: any;
  loginClass: any;
  error: any;
  loader: boolean = false;
  formLogin: FormGroup;
  formBuilder: FormBuilder;

  constructor(
    public menu: MenuController,
    public platform: Platform,
    private authService: AuthenticationService,
    private logicsServices: LogicsService,
    private router: Router,
    @Inject(FormBuilder) private builder: FormBuilder

  ) {
    this.formBuilder = builder;
    this.createForm();
    this.error = ''
    this.authService.logout();
  }

  loginUser() {
    this.loader = true;
    let userData = {
      username: this.formLogin.get('username').value,
      password: this.formLogin.get('password').value
    }
    try{
      this.logicsServices.loginUser(userData).subscribe((response) => {
        console.log(response)
        if (response['token']) {
          this.authService.login(response);
          this.goHome(response);
        } else   {
          this.error = response['status'];
          console.log("error en login")
        }
        this.loader = false;
      },
      error => {
        console.log(' _Error',error);
        this.loader = false;
        if(error.error['non_field_errors']){
          this.error = error.error['non_field_errors'].toString();
        }
        else if(error.error){
          this.error = 'Debes ingresar usuario y contraseña.';
        }
        
      })
    }catch(e){
      console.log(e);
      this.error = 'Error en autenticación. comunicar al administrador. Detalle: ' + e.toString();
      this.loader = false;
    }
  }

  goHome(response: any){
    if(response['groups']){
      let groups:any[] = response['groups'];
      groups = groups.filter(group => {
        return group.name == 'drivers'
      })
      if(groups.length>0){
        this.router.navigate(['/services']);
      }else{
        this.router.navigate(['/services']);
      }
    }
  }

  ngOnInit() {
    this.createForm();
    this.authService.logout();
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      username: [''],
      password: [''],
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

}
