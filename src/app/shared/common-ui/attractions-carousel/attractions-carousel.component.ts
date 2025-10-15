import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, signal, ViewChild} from '@angular/core';
import {Attraction} from '../../../../types/Attraction';
import {NgOptimizedImage} from '@angular/common';
import {ProfileIcon} from '../../../../../public/assets/icons/arrow-icon';

@Component({
  selector: 'app-attractions-carousel',
  imports: [
    NgOptimizedImage,
    ProfileIcon
  ],
  templateUrl: './attractions-carousel.component.html',
  styleUrl: './attractions-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class AttractionsCarouselComponent implements AfterViewInit {
  canScrollLeft = signal(false);
  canScrollRight = signal(true);
  attractions = input<Attraction[]>([]);
  currentPage = signal(0)
  private cardsPerPage!: number;
  private cardStep = 174 + 8;

  @ViewChild('cardsContainer') cardsContainer!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    const c = this.cardsContainer.nativeElement;
    this.cardsPerPage = Math.floor(c.clientWidth / this.cardStep);
    this.updateScrollSignals(c);
  }

  onScroll(e: Event) {
    const container = e.target as HTMLElement;
    const page = Math.round(container.scrollLeft / (this.cardStep * this.cardsPerPage));
    this.currentPage.set(page);
    this.updateScrollSignals(container);
  }

  scrollToPage(deltaCards: number) {
    const container = this.cardsContainer.nativeElement;
    const target = container.scrollLeft + deltaCards * this.cardStep;
    container.scrollTo({left: target, behavior: 'smooth'});
  }

  scrollLeft() {
    this.scrollToPage(-2);
  }

  scrollRight() {
    this.scrollToPage(2);
  }

  private updateScrollSignals(container: HTMLElement): void {
    this.canScrollLeft.set(container.scrollLeft > 0);
    this.canScrollRight.set(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  }
}
