import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UserActions from '../state/user/user.actions';
import { UserProfile } from '../state/user/user.actions';
import {
  selectUserProfile,
  selectUserLoading,
  selectUserError,
} from '../state/user/user.selectors';

@Component({
  selector: 'app-account-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Mon Profil</h1>

      @if (loading$ | async) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (error$ | async; as error) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erreur: {{ error.message || 'Une erreur est survenue' }}
        </div>
      }

      @if (profile$ | async; as profile) {
        <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl">
          <div class="space-y-4">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                [value]="profile.username"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                [value]="profile.email"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                [(ngModel)]="editableProfile.fullName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Newsletter -->
            <div class="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                [(ngModel)]="editableProfile.preferences.newsletter"
                class="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label for="newsletter" class="ml-2 text-sm text-gray-700">
                Recevoir la newsletter
              </label>
            </div>

            <!-- Default Min Rating -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Note minimum par défaut (filtre produits)
              </label>
              <select
                [(ngModel)]="editableProfile.preferences.defaultMinRating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option [value]="0">Aucun filtre</option>
                <option [value]="1">⭐ 1+</option>
                <option [value]="2">⭐ 2+</option>
                <option [value]="3">⭐ 3+</option>
                <option [value]="4">⭐ 4+</option>
                <option [value]="5">⭐ 5</option>
              </select>
            </div>

            <!-- Default Address -->
            @if (editableProfile.defaultAddress) {
              <div class="border-t pt-4 mt-4">
                <h3 class="text-lg font-semibold mb-3">Adresse par défaut</h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rue</label>
                    <input
                      type="text"
                      [(ngModel)]="editableProfile.defaultAddress.street"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        [(ngModel)]="editableProfile.defaultAddress.city"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Code postal
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="editableProfile.defaultAddress.postalCode"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <input
                      type="text"
                      [(ngModel)]="editableProfile.defaultAddress.country"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            }

            <!-- Actions -->
            <div class="flex gap-3 pt-4">
              <button
                (click)="saveProfile()"
                [disabled]="loading$ | async"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Enregistrer
              </button>
              <button
                (click)="resetForm(profile)"
                [disabled]="loading$ | async"
                class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AccountProfilePageComponent implements OnInit {
  profile$: Observable<UserProfile | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  editableProfile: UserProfile = {
    id: '',
    username: '',
    email: '',
    fullName: '',
    preferences: {
      newsletter: false,
      defaultMinRating: 0,
    },
  };

  constructor(private store: Store) {
    this.profile$ = this.store.select(selectUserProfile);
    this.loading$ = this.store.select(selectUserLoading);
    this.error$ = this.store.select(selectUserError);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserProfile());

    this.profile$.subscribe((profile) => {
      if (profile) {
        this.editableProfile = JSON.parse(JSON.stringify(profile));
      }
    });
  }

  saveProfile(): void {
    this.store.dispatch(
      UserActions.updateUserProfile({
        updates: {
          fullName: this.editableProfile.fullName,
          defaultAddress: this.editableProfile.defaultAddress,
          preferences: this.editableProfile.preferences,
        },
      })
    );
  }

  resetForm(profile: UserProfile): void {
    this.editableProfile = JSON.parse(JSON.stringify(profile));
  }
}
