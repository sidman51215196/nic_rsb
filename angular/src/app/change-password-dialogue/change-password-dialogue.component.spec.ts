import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDialogueComponent } from './change-password-dialogue.component';

describe('ChangePasswordDialogueComponent', () => {
  let component: ChangePasswordDialogueComponent;
  let fixture: ComponentFixture<ChangePasswordDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangePasswordDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
