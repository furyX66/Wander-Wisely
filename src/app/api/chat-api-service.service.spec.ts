import { TestBed } from '@angular/core/testing';

import { ChatApiServiceService } from './chat-api-service.service';

describe('ChatApiServiceService', () => {
  let service: ChatApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
