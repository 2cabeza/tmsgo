import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BtnSubsidiaryComponent } from './btn-subsidiary.component';

describe('BtnSubsidiaryComponent', () => {
  let component: BtnSubsidiaryComponent;
  let fixture: ComponentFixture<BtnSubsidiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnSubsidiaryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
