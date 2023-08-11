import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TmsPage } from './tms.page';

describe('TmsPage', () => {
  let component: TmsPage;
  let fixture: ComponentFixture<TmsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
