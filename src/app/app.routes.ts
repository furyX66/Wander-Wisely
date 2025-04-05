import { Routes } from '@angular/router';
import {MainPageComponent} from './common-ui/main-screen/main-page/main-page.component';
import {ChatPageComponent} from './common-ui/chat/chat-page/chat-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainPageComponent,
  },
  {
    path: 'chat',
    component: ChatPageComponent,
  },
  {
    path: '**',
    redirectTo: 'main',
  },
];
