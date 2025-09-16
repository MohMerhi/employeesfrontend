import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLeaveComponent } from './delete-leave-component';

describe('DeleteLeaveComponent', () => {
  let component: DeleteLeaveComponent;
  let fixture: ComponentFixture<DeleteLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteLeaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
