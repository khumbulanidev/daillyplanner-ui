import { TestBed } from '@angular/core/testing';
import { PasswordInputService } from './password-input.service';



describe('PasswordInputService', () => {
  let service: PasswordInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
