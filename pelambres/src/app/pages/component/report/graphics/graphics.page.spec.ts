import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraphicsPage } from './graphics.page';

describe('GraphicsPage', () => {
  let component: GraphicsPage;
  let fixture: ComponentFixture<GraphicsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
