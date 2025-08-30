import { TestBed } from '@angular/core/testing';
import { DateFormatService } from './dateformat.service';



describe('DateformatService', () => {
  let service: DateFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
