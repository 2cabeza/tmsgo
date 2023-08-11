import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AngularMaterialModule } from 'src/app/models/material.module';
import { ComponentPageModule } from './component.module';

import { ComponentPage } from './component.page';

describe('ComponentPage', () => {
  let component: ComponentPage;
  let fixture: ComponentFixture<ComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentPage ],
      imports: [ AngularMaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ComponentPage ],
  //     imports: [IonicModule.forRoot()]
  //   }).compileComponents();

  //   fixture = TestBed.createComponent(ComponentPage);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
