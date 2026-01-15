import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {ChatSessionService} from '../services/chat-session.service';
import {UserService} from '../services/user.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

export const chatGuard: CanActivateFn = (route) => {
  const chatSessionService = inject(ChatSessionService);
  const userService = inject(UserService);
  const router = inject(Router);
  const sessionIdParam = route.paramMap.get('id');

  if (!sessionIdParam) {
    return true;
  }

  const sessionId = Number(sessionIdParam);

  if (isNaN(sessionId) || sessionId <= 0) {
    console.warn(`Invalid session ID: ${sessionIdParam}`);
    router.navigate(['/chat']);
    return false;
  }

  return chatSessionService.getSessionById(sessionId).pipe(
    switchMap(session => {
      if (!session) {
        console.warn(`Chat ${sessionId} not found`);
        router.navigate(['/chat']);
        return of(false);
      }

      return userService.currentUser$.pipe(
        map(currentUser => {
          if (!currentUser) {
            console.warn('User not authenticated');
            router.navigate(['/chat']);
            return false;
          }

          if (session.session.userId !== currentUser.userId) {
            console.log('Current user ID: ', currentUser.userId);
            console.warn(`User ${currentUser.userId} is not owner of chat ${sessionId}`);
            router.navigate(['/chat']);
            return false;
          }

          return true;
        })
      );
    }),
    catchError(error => {
      console.error('Guard error:', error);
      router.navigate(['/chat']);
      return of(false);
    })
  );
};
