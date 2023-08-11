import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewRoutePage } from './view-route.page';

describe('ViewRoutePage', () => {
  let component: ViewRoutePage;
  let fixture: ComponentFixture<ViewRoutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoutePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
