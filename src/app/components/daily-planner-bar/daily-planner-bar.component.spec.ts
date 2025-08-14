import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlannerBarComponent } from './daily-planner-bar.component';

describe('DailyPlannerBarComponent', () => {
  let component: DailyPlannerBarComponent;
  let fixture: ComponentFixture<DailyPlannerBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyPlannerBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyPlannerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
