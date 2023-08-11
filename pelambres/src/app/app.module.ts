import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuardService } from './services/guard.service';
import { AuthenticationService } from './services/authentication.service';
import { RegistrarEventoPage } from './pages/registrar-evento/registrar-evento.page';
import { RegistrarEventoPageModule } from './pages/registrar-evento/registrar-evento.module';
import { LogicsService } from './services/logics.service';
import { JwtInterceptor } from './services/jwt.interceptor';
import { RegistroSolicitudPageModule } from './pages/registro-solicitud/registro-solicitud.module';
import { CommonModule } from '@angular/common';
import { SearchPageModule } from './pages/search/search.module';
import { EditPageModule } from './pages/edit/edit.module';
import { ServiceOrderDetailPageModule } from './pages/service-order-detail/service-order-detail.module';
//IMPORTAMOS GEOLOCATION Y GEOCODER
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SafePipeModule } from './pipes/safe.pipe.module';
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalComponent } from './components/framework/search/modal/modal.component';
import { MapComponent } from './components/framework/map/map.component';
import { QRCodeModule } from 'angularx-qrcode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ScannerComponent } from './components/framework/scanner/scanner.component';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatExpansionModule, MatSortModule, MatTableModule } from '@angular/material';
import { AngularMaterialModule } from './models/material.module';
import { ComponentPageModule } from './pages/component/component.module';
import { GridComponent } from './components/framework/grid/grid.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MapModalComponent } from './components/framework/map-modal/map-modal.component';
import { RenderHtmlComponent } from './components/framework/render-html/render-html.component';

@NgModule({

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    QRCodeModule,
    // for modal
    RegistrarEventoPageModule,
    RegistroSolicitudPageModule,
    SearchPageModule,
    EditPageModule,
    ServiceOrderDetailPageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    SafePipeModule,
    NgxDatatableModule,
    CdkTableModule,
    AngularMaterialModule,
   ],
  exports: [
    
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    Geolocation,    
    NativeGeocoder,
    BarcodeScanner,
    QRScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Keyboard,
    LogicsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }, GuardService
  ],
  bootstrap: [AppComponent],
  entryComponents: [RegistrarEventoPage, 
                    MediaViewerComponent, 
                    ModalComponent, 
                    MapModalComponent, 
                    MapComponent, 
                    ScannerComponent, 
                    GridComponent,
                    RenderHtmlComponent],
  declarations: [
    AppComponent
  ],
})
export class AppModule { }
