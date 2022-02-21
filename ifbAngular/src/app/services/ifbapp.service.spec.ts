import { TestBed } from '@angular/core/testing';

import { IfbappService } from './ifbapp.service';

describe('IfbappService', () => {
  let service: IfbappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IfbappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
