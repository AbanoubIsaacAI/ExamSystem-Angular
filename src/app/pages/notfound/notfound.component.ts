import { Component } from '@angular/core';
import { PRIDE_LOADER_ANIMATION } from '../../../assets/animation/pride-loader.animation';
import { LottieAnimationComponent } from '../../components/lottie-animation/lottie-animation.component';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  imports: [LottieAnimationComponent],
  styleUrl: './notfound.component.css',
})
export class NotfoundComponent {
  animationData = PRIDE_LOADER_ANIMATION;
}
