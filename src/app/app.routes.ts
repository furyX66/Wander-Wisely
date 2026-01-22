import {Routes} from '@angular/router';
import {chatGuard} from './core/guards/chat-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./features/main-page/main-page.component")
      .then(c => c.MainPageComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import("./features/chat-page/chat-page.component")
      .then(c => c.ChatPageComponent),
  },
  {
    path: 'chat/:id',
    loadComponent: () => import("./features/chat-page/chat-page.component")
      .then(c => c.ChatPageComponent),
    canActivate: [chatGuard]
  },
  {
    path: 'my-trips',
    loadComponent: () => import("./features/user-trips-page/user-trips-page.component")
      .then(c => c.UserTripsPageComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
