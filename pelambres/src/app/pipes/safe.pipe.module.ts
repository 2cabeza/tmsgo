import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SafePipe
  ],
  declarations: [
    SafePipe
  ]
})
export class SafePipeModule { }