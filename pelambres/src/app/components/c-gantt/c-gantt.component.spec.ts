import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CGanttComponent } from './c-gantt.component';

describe('CGanttComponent', () => {
  let component: CGanttComponent;
  let fixture: ComponentFixture<CGanttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CGanttComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
