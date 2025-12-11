import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {IAttraction} from '../../../../interfaces/IAttraction';
import {ArrowIconComponent} from '../../../../../public/assets/icons/arrow-icon.component';
import {FavoriteIconComponent} from '../../../../../public/assets/icons/favorite-icon.component';
import {CrossIconComponent} from '../../../../../public/assets/icons/cross-icon.component';
import {DropdownArrowIconComponent} from '../../../../../public/assets/icons/dropdown-arrow-icon.component';
import {StarIconComponent} from '../../../../../public/assets/icons/star-icon.component';
import {MoneyIconComponent} from '../../../../../public/assets/icons/money-icon.component';
import {ImageLoaderService} from '../../../core/services/image-loader.service';
import {ChatSessionService} from '../../../core/services/chat-session.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-attractions-carousel',
  imports: [
    ArrowIconComponent,
    FavoriteIconComponent,
    CrossIconComponent,
    DropdownArrowIconComponent,
    StarIconComponent,
    MoneyIconComponent,
    AsyncPipe
  ],
  templateUrl: './attractions-carousel.component.html',
  styleUrl: './attractions-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class AttractionsCarouselComponent implements AfterViewInit, OnInit {
  private chatSessionService = inject(ChatSessionService);
  private imageLoader = inject(ImageLoaderService);
  canScrollLeft = signal(false);
  canScrollRight = signal(true);
  isShown = signal(true);
  currentPage = signal(0)
  private cardsPerPage!: number;
  private cardStep = 182;
  private observer!: IntersectionObserver;

  attractions$!: Observable<IAttraction[]>;

  @ViewChild('cardsContainer') cardsContainer!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.attractions$ = this.chatSessionService.attractions$;
  }

  ngAfterViewInit() {
    const c = this.cardsContainer.nativeElement;
    this.cardsPerPage = Math.floor(c.clientWidth / this.cardStep);
    this.updateScrollSignals(c);
    this.initLazyObserver();
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
    container.scrollTo({left: target, behavior: "smooth"});
  }

  scrollLeft() {
    this.scrollToPage(-2);
  }

  scrollRight() {
    this.scrollToPage(2);
  }

  onButtonClick(){
    this.isShown.set(!this.isShown());
  }

  private updateScrollSignals(container: HTMLElement): void {
    this.canScrollLeft.set(container.scrollLeft > 0);
    this.canScrollRight.set(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  }

  private initLazyObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }
        const img = entry.target as HTMLImageElement;
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          this.imageLoader.loadImageBlob(dataSrc).subscribe({
            next: resp => {
              const objectUrl = URL.createObjectURL(resp.body!);
              img.setAttribute('src', objectUrl);
              img.removeAttribute('data-src');
              this.observer.unobserve(img);
            },
            error: () => {
              img.setAttribute('src', 'assets/img/stas.png');
              img.removeAttribute('data-src');
              this.observer.unobserve(img);
            }
          });
        }
      });
    }, {
      root: this.cardsContainer.nativeElement,
      rootMargin: '50px',
      threshold: 0.1
    });

    const images: NodeListOf<HTMLImageElement> =
      this.cardsContainer.nativeElement.querySelectorAll('img.lazy-img');
    images.forEach(img => this.observer.observe(img));
  }
}
