import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaylistComponent } from './daylist.component';

describe('DaylistComponent', () => {
  let component: DaylistComponent;
  let fixture: ComponentFixture<DaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaylistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
