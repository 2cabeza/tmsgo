import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanviewPage } from './scanview.page';

describe('ScanviewPage', () => {
  let component: ScanviewPage;
  let fixture: ComponentFixture<ScanviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
