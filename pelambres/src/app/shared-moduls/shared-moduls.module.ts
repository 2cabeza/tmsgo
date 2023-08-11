import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderBarComponent } from '../components/header-bar/header-bar.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoaderComponent } from '../components/framework/loader/loader.component';
import { UploadfileComponent } from '../components/uploadfile/uploadfile.component';
import { GoSelectComponent } from '../components/go-select/go-select.component';
import { BtnSubsidiaryComponent } from '../components/btn-subsidiary/btn-subsidiary.component';
import { SafePipeModule } from '../pipes/safe.pipe.module';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MediaViewerComponent } from '../components/media-viewer/media-viewer.component';
import { Utils } from 'src/app/utils/utils';
import { SearchComponent } from '../components/framework/search/search.component';
import { MapComponent } from '../components/framework/map/map.component';
import { ModalComponent } from '../components/framework/search/modal/modal.component';
import { UploadComponent } from '../components/framework/upload/upload.component';
import { ScannerComponent } from '../components/framework/scanner/scanner.component';
import { ProcessComponent } from '../components/framework/process/process.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultifileComponent } from '../components/framework/multifile/multifile.component';
import { TextboxComponent } from '../components/framework/textbox/textbox.component';
import { GridComponent } from '../components/framework/grid/grid.component';
import { BetweenDatesComponent } from '../components/framework/between-dates/between-dates.component';
import { MapModalComponent } from '../components/framework/map-modal/map-modal.component';
import { RenderHtmlComponent } from '../components/framework/render-html/render-html.component';
import { TrackingComponent } from '../pages/tms/tracking/tracking.component';
declare var google;

@NgModule({
  imports: [CommonModule, IonicModule, SafePipeModule, ReactiveFormsModule],
  declarations: [HeaderBarComponent, 
                LoaderComponent, 
                UploadfileComponent, 
                GoSelectComponent, 
                BtnSubsidiaryComponent, 
                MediaViewerComponent,
                MapComponent,
                MapModalComponent,
                SearchComponent,
                ModalComponent,
                UploadComponent,
                ScannerComponent,
                ProcessComponent,
                MultifileComponent,
                TextboxComponent,
                GridComponent,
                BetweenDatesComponent,
                RenderHtmlComponent,
                TrackingComponent
              ],
  exports: [HeaderBarComponent, 
            CommonModule, 
            LoaderComponent, 
            UploadfileComponent, 
            GoSelectComponent, 
            BtnSubsidiaryComponent,
            MapComponent,
            MapModalComponent,
            SearchComponent,
            ModalComponent,
            LoaderComponent,
            UploadComponent,
            ScannerComponent,
            ProcessComponent,
            MultifileComponent,
            TextboxComponent,
            GridComponent,
            BetweenDatesComponent,
            RenderHtmlComponent,
            TrackingComponent
          ],
          schemas: [
            CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
          ],
  providers: [Keyboard]
})
export class SharedModulsModule { }
