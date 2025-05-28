import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {provideAnimations} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {JwtInterceptor} from './interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ...(appConfig.providers ?? []),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ]
}).catch((err) => console.error(err));
