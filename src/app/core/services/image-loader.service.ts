import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageLoaderService {
  private http = inject(HttpClient);

  loadImageBlob(url: string, maxRetries = 3) {
    return this.http.get(url, { responseType: 'blob', observe: 'response' }).pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          if (error.status !== 429) {
            throw error;
          }
          const backoffTime = Math.pow(2, retryCount - 1) * 500;
          return timer(backoffTime);
        }
      })
    );
  }
}
