import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-lottie-animation',
  template: '<div [id]="containerId"></div>',
  styleUrls: ['./lottie-animation.component.css'],
})
export class LottieAnimationComponent implements AfterViewInit, OnDestroy {
  @Input() containerId: string = 'lottie-container';
  @Input() animationData: any;
  @Input() renderer: 'svg' | 'canvas' | 'html' = 'svg';
  @Input() loop: boolean = true;
  @Input() autoplay: boolean = true;
  @Input() width?: string;
  @Input() height?: string;

  private animation: AnimationItem | null = null;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.loadAnimation();
  }

  private loadAnimation(): void {
    if (!this.animationData) return;

    this.animation = lottie.loadAnimation({
      container: this.elementRef.nativeElement.querySelector(
        `#${this.containerId}`
      ),
      renderer: this.renderer,
      loop: this.loop,
      autoplay: this.autoplay,
      animationData: this.animationData,
    });
  }

  ngOnDestroy(): void {
    if (this.animation) {
      this.animation.destroy();
    }
  }
}
