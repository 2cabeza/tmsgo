import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddCostPage } from './add-cost.page';

describe('AddCostPage', () => {
  let component: AddCostPage;
  let fixture: ComponentFixture<AddCostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
