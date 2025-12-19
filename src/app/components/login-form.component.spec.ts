import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit submitForm with username and password on valid submit', () => {
    let emittedValue: any = null;
    component.submitForm.subscribe((val) => (emittedValue = val));

    component.form.patchValue({ username: 'testuser', password: 'testpass' });
    component.submit();

    expect(emittedValue).toEqual({ username: 'testuser', password: 'testpass' });
  });

  it('should not emit if form is invalid (empty)', () => {
    let emittedCount = 0;
    component.submitForm.subscribe(() => emittedCount++);

    component.form.patchValue({ username: '', password: '' });
    component.submit();

    // validation simple : on vérifie que si vide, pas d'emission (ici form.valid reste true car pas de validators)
    // mais on peut adapter selon besoins; ceci teste la logique du composant
    expect(emittedCount).toBe(0);
  });
});
