import {Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, filter, Observable} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';

interface ModalState {
  id: string;
  isOpen: boolean;
  data?: any;
  timestamp?: number;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly modalState$ = new BehaviorSubject<Record<string, ModalState>>({});

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.closeAllModals();
      });
  }

  get allModalsState$(): Observable<Record<string, ModalState>> {
    return this.modalState$.asObservable();
  }

  getModalState$(modalId: string): Observable<boolean> {
    return new Observable(observer => {
      this.modalState$.subscribe(state => {
        observer.next(state[modalId]?.isOpen || false);
        distinctUntilChanged()
      });
    });
  }

  openModal(modalId: string, data?: any): void {
    const currentState = this.modalState$.value;
    this.modalState$.next({
      ...currentState,
      [modalId]: {
        id: modalId,
        isOpen: true,
        data,
        timestamp: Date.now()
      }
    });
  }


  closeModal(modalId: string): void {
    const currentState = this.modalState$.value;
    if (currentState[modalId]) {
      this.modalState$.next({
        ...currentState,
        [modalId]: {
          ...currentState[modalId],
          isOpen: false
        }
      });
    }
  }

  closeAllModals(): void {
    const currentState = this.modalState$.value;
    const updatedState = Object.keys(currentState).reduce((acc, key) => {
      acc[key] = { ...currentState[key], isOpen: false };
      return acc;
    }, {} as Record<string, ModalState>);

    this.modalState$.next(updatedState);
  }

  toggleModal(modalId: string, data?: any): void {
    const currentState = this.modalState$.value;
    const isCurrentlyOpen = currentState[modalId]?.isOpen || false;

    if (isCurrentlyOpen) {
      this.closeModal(modalId);
    } else {
      this.openModal(modalId, data);
    }
  }

  isModalOpen(modalId: string): boolean {
    const currentState = this.modalState$.value;
    return currentState[modalId]?.isOpen || false;
  }

  getModalData(modalId: string): any {
    const currentState = this.modalState$.value;
    return currentState[modalId]?.data;
  }
}
