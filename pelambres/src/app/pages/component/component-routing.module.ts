import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentPage } from './component.page';

const routes: Routes = [
  {
    path: '',
    component: ComponentPage
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then( m => m.FormsPageModule)
  },
  {
    path: 'workflow',
    loadChildren: () => import('./workflow/workflow.module').then( m => m.WorkflowPageModule)
  },
  {
    path: 'scanview',
    loadChildren: () => import('./scanview/scanview.module').then( m => m.ScanviewPageModule)
  },
  {
    path: 'report/graphics',
    loadChildren: () => import('./report/graphics/graphics.module').then( m => m.GraphicsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentPageRoutingModule {}
