import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BetweenDatesComponent } from './between-dates.component';

describe('BetweenDatesComponent', () => {
  let component: BetweenDatesComponent;
  let fixture: ComponentFixture<BetweenDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetweenDatesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BetweenDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
