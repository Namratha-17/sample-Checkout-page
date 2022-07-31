import { TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    fixture.detectChanges();
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
