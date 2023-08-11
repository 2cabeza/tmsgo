import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GoSelectComponent } from './components/go-select/go-select.component';
import {  GuardService  } from './services/guard.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/services',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./pages/solicitudes/solicitudes.module').then( m => m.SolicitudesPageModule),
    canActivate: [GuardService]

  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/ocupacion/ocupacion.module').then( m => m.OcupacionPageModule),
    canActivate: [GuardService]

  },
  {
    path: 'service-record',
    loadChildren: () => import('./pages/registro-solicitud/registro-solicitud.module').then( m => m.RegistroSolicitudPageModule),
    canActivate: [GuardService]

  },
  {
    path: 'service-record/:sid',
    loadChildren: () => import('./pages/registro-solicitud/registro-solicitud.module').then( m => m.RegistroSolicitudPageModule),
    canActivate: [GuardService]

  },
  {
    path: 'cierre-solicitudes/:id',
    loadChildren: () => import('./pages/registrar-evento/registrar-evento.module').then( m => m.RegistrarEventoPageModule),
    canActivate: [GuardService]

  },
  {
    path: 'chat-bot',
    loadChildren: () => import('./pages/chat-bot/chat-bot.module').then( m => m.ChatBotPageModule),
    canActivate: [GuardService]
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./pages/edit/edit.module').then( m => m.EditPageModule)
  },
  // {
  //   path: 'detail-service',
  //   loadChildren: () => import('./pages/detail-service/detail-service.module').then( m => m.DetailServicePageModule)
  // },
  {
    path: 'service-order-detail',
    loadChildren: () => import('./pages/service-order-detail/service-order-detail.module').then( m => m.ServiceOrderDetailPageModule)
  },
  {
    path: 'metrics',
    loadChildren: () => import('./pages/metrics/metrics.module').then( m => m.MetricsPageModule)
  },
    {path: 'go', component: GoSelectComponent
  },
  {
    path: 'tests',
    loadChildren: () => import('./pages/tests/tests.module').then( m => m.TestsPageModule)
  },
  {
    path: 'component',
    loadChildren: () => import('./pages/component/component.module').then( m => m.ComponentPageModule)
  },
  {
    path: 'tms',
    loadChildren: () => import('./pages/tms/tms.module').then( m => m.TmsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
