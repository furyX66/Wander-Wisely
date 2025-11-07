import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {ChatSessionService} from '../services/chat-session.service';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';

export const chatGuard: CanActivateFn = (route) => {
  const chatSessionService = inject(ChatSessionService);
  const router = inject(Router);

  const sessionId = Number(route.paramMap.get('id'));

  if (!sessionId) {
    return true;
  }

  return chatSessionService.getSessionWithMessages(sessionId).pipe(
    map(session => {
      if (!session) {
        console.warn(`Chat ${sessionId} not found`);
        router.navigate(['/chat']);
        return false;
      }
      return true;
    }),
    catchError(error => {
      console.error('Guard error:', error);
      router.navigate(['/chat']);
      return of(false);
    })
  );
};
