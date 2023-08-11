import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistroSolicitudPage } from './registro-solicitud.page';

describe('RegistroSolicitudPage', () => {
  let component: RegistroSolicitudPage;
  let fixture: ComponentFixture<RegistroSolicitudPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroSolicitudPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroSolicitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
