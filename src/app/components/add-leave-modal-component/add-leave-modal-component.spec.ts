import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveModalComponent } from './add-leave-modal-component';

describe('AddLeaveModalComponent', () => {
  let component: AddLeaveModalComponent;
  let fixture: ComponentFixture<AddLeaveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLeaveModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLeaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
