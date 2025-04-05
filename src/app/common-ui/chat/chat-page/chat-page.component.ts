import { Component } from '@angular/core';
import {SideBarComponent} from '../side-bar/side-bar.component';

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {

}
