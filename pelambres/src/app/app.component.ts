import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LogicsService } from './services/logics.service';
import { Application, List, Organization, Provider } from './models/models';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'], 
})
export class AppComponent implements OnInit {

  userInfo: any;
  username: any;
  menu: List;
  application: Application;
  public selectedIndex = 0;
  menuOptions: List[] = [];
  menuOptionLength: number = 0;
  menuCont: number = 0;
  isAuth = false;
  provider: Provider;
  organization: Organization;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuCtrl: MenuController,
    private router: Router,
    private authenticationService: AuthenticationService,
    private service: LogicsService,
    private route: ActivatedRoute,
  ) {
    this.initializeApp();

    this.userInfo = {};
    this.username = ''
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // getMenuOtionsAllowed(){
  //   this.service.getListMenu().subscribe(response => {
  //     this.menu = Object.assign(new List(), response);
  //     if(this.menu.childs.length>0){
  //       // console.log(this.menu.childs[0].action_value);
  //       // this.router.navigate([this.menu.childs[0].action_value]);
  //     }
  //   });
  // }

  getApplication(){
    console.log('call app')
    this.service.getApplication().subscribe(response => {
      this.application = null;
      this.application = Object.assign(new Application(), response);
      console.log('app', this.application)
      if ( this.application.lists.length > 0 ){
        this.menuOptionLength = this.application.lists.length;
        this.generateList(this.application.lists);
      }
    });
  }

  generateList(list:List[]){
    // console.log('generateList', list);
    for(let item of list){
      this.menuOptions.push(item)
      if(item.childs){
        this.generateList(item.childs);
      }else{
        // console.log('end menu', this.menuOptions)
      }
    }

    this.menuCont++;
    if(this.menuCont == 1){
      // console.log('proceso terminado.')
    }
  }

  ngOnInit() {

    console.log('VERSION', VERSION);
    this.authenticationService.authState.subscribe(state => {
      if(state){
        console.log('state', state);
        this.isAuth = true;
        console.log('isAuth');
        try {
          
          this.userInfo = this.authenticationService.getUser();
          // if(this.route.snapshot.paramMap.get("sid")){
          // }
          // console.log('this.route', this.route)
          // console.log('this.router', this.router)
          this.menuOptions = []; 
          // console.log('GET APP', this.router)
          this.getApplication();
          // this.router.navigate(['component']);
          
          if (this.userInfo) {
            this.username = this.userInfo.username;
          }
        } catch (e) {
          console.log(e)
        }
      }else{
        console.log('NoisAuth');
        this.router.navigate(['login']);
      }
    });

    // provider
    this.authenticationService.provider.subscribe((provider) => {
      console.log('provider', provider)
      this.provider = provider;
    })
    // organization
    this.authenticationService.organization.subscribe((organization) => {
      console.log('organization', organization)
      this.organization = organization;
    })
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
  logoutUser() {
    this.menuOptions = [];
    this.authenticationService.logout();
  }
}
