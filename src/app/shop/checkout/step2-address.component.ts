import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step2-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Adresse de livraison</h2>

      <form [formGroup]="addressForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              formControlName="firstName"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [class.border-red-500]="
                addressForm.get('firstName')?.invalid &&
                addressForm.get('firstName')?.touched
              "
            />
            @if (
              addressForm.get('firstName')?.invalid && addressForm.get('firstName')?.touched
            ) {
              <p class="mt-1 text-sm text-red-600">Le prénom est requis</p>
            }
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              id="lastName"
              formControlName="lastName"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [class.border-red-500]="
                addressForm.get('lastName')?.invalid && addressForm.get('lastName')?.touched
              "
            />
            @if (addressForm.get('lastName')?.invalid && addressForm.get('lastName')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
            }
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [class.border-red-500]="
              addressForm.get('email')?.invalid && addressForm.get('email')?.touched
            "
          />
          @if (addressForm.get('email')?.invalid && addressForm.get('email')?.touched) {
            <p class="mt-1 text-sm text-red-600">Veuillez entrer un email valide</p>
          }
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            formControlName="phone"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [class.border-red-500]="
              addressForm.get('phone')?.invalid && addressForm.get('phone')?.touched
            "
          />
          @if (addressForm.get('phone')?.invalid && addressForm.get('phone')?.touched) {
            <p class="mt-1 text-sm text-red-600">Le téléphone est requis</p>
          }
        </div>

        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            Adresse *
          </label>
          <input
            type="text"
            id="address"
            formControlName="address"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [class.border-red-500]="
              addressForm.get('address')?.invalid && addressForm.get('address')?.touched
            "
          />
          @if (addressForm.get('address')?.invalid && addressForm.get('address')?.touched) {
            <p class="mt-1 text-sm text-red-600">L'adresse est requise</p>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
              Ville *
            </label>
            <input
              type="text"
              id="city"
              formControlName="city"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [class.border-red-500]="
                addressForm.get('city')?.invalid && addressForm.get('city')?.touched
              "
            />
            @if (addressForm.get('city')?.invalid && addressForm.get('city')?.touched) {
              <p class="mt-1 text-sm text-red-600">La ville est requise</p>
            }
          </div>

          <div>
            <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">
              Code postal *
            </label>
            <input
              type="text"
              id="postalCode"
              formControlName="postalCode"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [class.border-red-500]="
                addressForm.get('postalCode')?.invalid &&
                addressForm.get('postalCode')?.touched
              "
            />
            @if (
              addressForm.get('postalCode')?.invalid && addressForm.get('postalCode')?.touched
            ) {
              <p class="mt-1 text-sm text-red-600">Le code postal est requis</p>
            }
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <input
              type="text"
              id="country"
              formControlName="country"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [class.border-red-500]="
                addressForm.get('country')?.invalid && addressForm.get('country')?.touched
              "
            />
            @if (addressForm.get('country')?.invalid && addressForm.get('country')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le pays est requis</p>
            }
          </div>
        </div>

        <div class="flex gap-4 pt-6">
          <button
            type="button"
            (click)="goBack()"
            class="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Retour
          </button>
          <button
            type="submit"
            [disabled]="addressForm.invalid"
            class="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continuer vers la confirmation
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class Step2AddressComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  addressForm: FormGroup;

  constructor() {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['France', Validators.required],
    });

    // Load saved address if exists
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      try {
        this.addressForm.patchValue(JSON.parse(savedAddress));
      } catch (e) {
        console.error('Error loading saved address', e);
      }
    }
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      // Save address to localStorage
      localStorage.setItem('shippingAddress', JSON.stringify(this.addressForm.value));
      this.router.navigate(['/checkout/confirm']);
    }
  }

  goBack(): void {
    this.router.navigate(['/checkout']);
  }
}
