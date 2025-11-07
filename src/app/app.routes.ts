import {Routes} from '@angular/router';
import {MainPageComponent} from './features/main-page/main-page.component';
import {ChatPageComponent} from './features/chat-page/chat-page.component';
import {chatGuard} from './core/guards/chat-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'chat',
    component: ChatPageComponent,
  },
  {
    path: 'chat/:id',
    component: ChatPageComponent,
    canActivate: [chatGuard]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
