import {Component,} from '@angular/core';
import {SideBarComponent} from '../../shared/chat/side-bar/side-bar.component';
import {IAttraction} from '../../../interfaces/IAttraction';
import {RouterOutlet} from '@angular/router';

export interface ChatResponse {
  reply: string;
  places: IAttraction[];
}

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    RouterOutlet,
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent {

}
