import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTasksTableComponent } from './daily-tasks-table.component';

describe('DailyTasksTableComponent', () => {
  let component: DailyTasksTableComponent;
  let fixture: ComponentFixture<DailyTasksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyTasksTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyTasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
