import { Component } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-loading-animation',
  imports: [
    LottieComponent
  ],
  templateUrl: './loading-animation.component.html',
  styleUrl: './loading-animation.component.scss'
})
export class LoadingAnimationComponent {
  options: AnimationOptions = {
    path: '/assets/lottie/loading.json',
    renderer: 'svg',
    autoplay: true,
    loop: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet'
    }
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
