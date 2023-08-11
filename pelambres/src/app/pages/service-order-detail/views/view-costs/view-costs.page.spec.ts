import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewCostsPage } from './view-costs.page';

describe('ViewCostsPage', () => {
  let component: ViewCostsPage;
  let fixture: ComponentFixture<ViewCostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCostsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
