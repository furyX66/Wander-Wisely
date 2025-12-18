import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {
  private selectedSubject = new BehaviorSubject<Set<number>>(new Set());
  selected$ = this.selectedSubject.asObservable();

  toggle(id: number): void {
    const current = new Set(this.selectedSubject.value);
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedSubject.next(current);
  }

  isSelected(id: number | undefined): boolean {
    if (id === undefined) return false;
    return this.selectedSubject.value.has(id);
  }

  getSelected(): Set<number> {
    return this.selectedSubject.value;
  }

  clear(): void {
    this.selectedSubject.next(new Set());
  }
}
