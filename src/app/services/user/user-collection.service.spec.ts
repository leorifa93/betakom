import { TestBed } from '@angular/core/testing';

import { UserCollectionService } from './user-collection.service';

describe('UserCollectionService', () => {
  let service: UserCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
