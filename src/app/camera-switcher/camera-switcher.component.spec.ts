import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraSwitcherComponent } from './camera-switcher.component';

describe('CameraSwitcherComponent', () => {
  let component: CameraSwitcherComponent;
  let fixture: ComponentFixture<CameraSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraSwitcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CameraSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
