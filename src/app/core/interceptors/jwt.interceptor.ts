import { environment } from '../../../environments/environment';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  if (request.url.startsWith(environment.apiUrl)) {
    request = request.clone({
      withCredentials: true
    });
  }
  return next(request);
};
