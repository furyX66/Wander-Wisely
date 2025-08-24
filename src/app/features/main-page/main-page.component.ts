import {Component} from '@angular/core';
import {MainTitleComponent} from '../../shared/main-screen/main-title/main-title.component';
import {HeaderComponent} from '../../shared/main-screen/header/header.component';
import {ChatInputComponent} from "../../shared/common-ui/chat-input/chat-input.component";

@Component({
  selector: 'app-main-page',
  imports: [MainTitleComponent, HeaderComponent, ChatInputComponent,],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  handleChatInput(value: string) {
    console.log("Chat Input:", value);
  }
}
