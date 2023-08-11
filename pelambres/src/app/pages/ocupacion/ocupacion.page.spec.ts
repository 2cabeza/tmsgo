import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OcupacionPage } from './ocupacion.page';

describe('OcupacionPage', () => {
  let component: OcupacionPage;
  let fixture: ComponentFixture<OcupacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcupacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OcupacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
