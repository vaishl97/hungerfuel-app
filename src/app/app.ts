import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Variant {
  name: string;
  price: number;
}

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  rating: number;
  veg: boolean;
  emoji: string;
  description: string;
  prepTime: string;
  variants: Variant[];
  addons: Addon[];
}

interface Banner {
  tag: string;
  title: string;
  subtitle: string;
  code: string;
  image: string;
}

interface Offer {
  title: string;
  subtitle: string;
  code: string;
}

interface CartItem {
  cartKey: string;
  id: number;
  name: string;
  selectedVariant: Variant;
  selectedAddons: Addon[];
  qty: number;
}

interface User {
  name: string;
  phone: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="text-slate-900 antialiased flex flex-col min-h-screen selection:bg-rose-500 selection:text-white">

      <!-- Header -->
      <header class="glass-header border-b border-slate-200/80 sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between transition-all bg-white/90 backdrop-blur-md">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-rose-600 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-rose-600/30">H</div>
          <div>
            <span class="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">HungerFuel</span>
            <span class="hidden lg:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">AI KITCHEN v4</span>
          </div>
        </div>
        
        <!-- Location Picker -->
        <div (click)="openLocationModal()" class="hidden sm:flex items-center space-x-2 cursor-pointer bg-white hover:bg-slate-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm transition group">
          <svg class="w-4 h-4 md:w-5 md:h-5 text-rose-500 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            <ellipse cx="12" cy="21" rx="6" ry="1.5" opacity="0.8"/>
          </svg>
          <div class="text-left">
            <div class="font-medium text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider">Delivery To</div>
            <div class="text-[11px] md:text-xs font-semibold text-slate-800 truncate max-w-[120px] md:max-w-[180px]">{{currentLocation()}}</div>
          </div>
          <span class="text-[10px] text-slate-400">▼</span>
        </div>

        <!-- Account / User Action -->
        <div class="flex items-center gap-2 md:gap-3">
          <div (click)="openAccountModal()" class="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl font-semibold text-[11px] md:text-xs flex items-center gap-2 transition shadow-md shadow-slate-900/10">
            <span>👤</span>
            <span class="hidden sm:inline-block">{{ currentUser() ? currentUser()?.name : 'Sign In' }}</span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow container mx-auto px-4 lg:px-8 py-4 md:py-6 max-w-7xl">

        <!-- Modern Immersive Hero Header with Swiper implementation -->
        <div class="mb-6 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
          <div class="absolute -right-20 -top-20 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div id="heroSwiper" class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none smooth-scroll relative z-10 w-full scroll-smooth">
            <div *ngFor="let banner of sliderBanners; let i = index" class="w-full flex-none snap-center flex flex-row items-center justify-between p-4 sm:p-6 md:p-10 gap-3 md:gap-8">
              <div class="flex-1 space-y-1.5 sm:space-y-2 text-left min-w-0">
                <div class="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-400 text-[8px] sm:text-[9px] md:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-widest border border-rose-500/30">
                  <span>⚡ {{banner.tag}}</span>
                </div>
                <h1 class="text-base sm:text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight truncate sm:whitespace-normal">
                  {{banner.title}}
                </h1>
                <p class="text-slate-300 text-[11px] sm:text-xs md:text-sm font-normal line-clamp-2">
                  {{banner.subtitle}}
                </p>
                <div class="pt-0.5 sm:pt-1">
                  <button (click)="applySliderCode(banner.code)" class="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-[10px] sm:text-[11px] md:text-xs shadow-lg shadow-rose-600/30 transition">
                    Apply Code: {{banner.code}}
                  </button>
                </div>
              </div>

              <div class="w-24 h-24 sm:w-36 sm:h-36 md:w-56 md:h-56 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                <img [src]="banner.image" alt="Banner" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
          
          <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
            <div *ngFor="let b of sliderBanners; let i = index" [ngClass]="{'w-4 bg-rose-500': activeSlideIndex() === i, 'w-1.5 bg-white/40': activeSlideIndex() !== i}" class="h-1.5 rounded-full transition-all duration-300"></div>
          </div>
        </div>

        <!-- Offers Section -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <div class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span class="w-1 h-2.5 bg-amber-500 rounded-full"></span>
              OFFERS FOR YOU
            </div>
          </div>
          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            <div *ngFor="let offer of offersList" class="snap-start min-w-[220px] md:min-w-[260px] h-28 md:h-32 rounded-xl relative overflow-hidden shadow-sm hover-elevate shrink-0 cursor-pointer border border-slate-200" (click)="applyOfferCode(offer)">
              <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://placehold.co/400x200/0f172a/cbd5e1?text=Offer');"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"></div>
              
              <div class="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm">
                <span class="text-[10px] font-bold text-rose-600">⚡</span>
              </div>

              <div class="absolute bottom-2 left-3 right-3">
                <div class="text-white font-bold text-xs md:text-sm tracking-tight leading-tight">{{offer.title}}</div>
                <div class="text-[9px] md:text-[10px] font-medium text-amber-300 mt-0.5">{{offer.subtitle}}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="mb-6 space-y-3">
          <div class="relative max-w-full">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm">🔍</span>
            <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Search for Waffles, Kulfis, Shakes, Maggie..." class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-600 text-xs md:text-sm shadow-sm font-medium transition">
          </div>

          <!-- Compact & Smooth Categories Swiper -->
          <div class="flex items-center gap-2">
            <div id="categorySwiper" class="flex gap-2 overflow-x-auto pb-2 scrollbar-none items-center snap-x snap-mandatory flex-grow scroll-smooth">
              <button (click)="selectCategory('All')" [ngClass]="{'ring-2 ring-rose-600 bg-rose-50 text-rose-600 shadow-sm': selectedCategory() === 'All', 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50': selectedCategory() !== 'All'}" class="snap-start flex items-center gap-2 px-3.5 py-2 rounded-xl border whitespace-nowrap transition shrink-0">
                <div class="w-6 h-6 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-slate-900 text-white font-bold text-xs">
                  🔥
                </div>
                <span class="text-xs font-semibold">All Items</span>
              </button>

              <button *ngFor="let cat of categories" (click)="selectCategory(cat)" [ngClass]="{'ring-2 ring-rose-600 bg-rose-50 text-rose-600 shadow-sm': selectedCategory() === cat, 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50': selectedCategory() !== cat}" class="snap-start flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap transition shrink-0">
                <div class="w-6 h-6 rounded-full overflow-hidden shadow-sm border border-slate-100 shrink-0">
                  <img [src]="categoryImages[cat] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80'" alt="{{cat}}" class="w-full h-full object-cover">
                </div>
                <span class="text-xs font-semibold">{{cat}}</span>
              </button>
            </div>

            <!-- Veg Filter Toggle Badge -->
            <div class="shrink-0 pl-1 border-l border-slate-200">
              <label class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer bg-white px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm whitespace-nowrap hover:bg-slate-50 transition">
                <input type="checkbox" [ngModel]="vegOnly()" (ngModelChange)="vegOnly.set($event)" class="rounded text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5 border-slate-300">
                🌱 Veg
              </label>
            </div>
          </div>
        </div>

        <!-- Menu Grid -->
        <div class="mb-24 md:mb-12">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="text-lg md:text-xl font-bold text-slate-900">{{selectedCategory() === 'All' ? 'Explore Full Menu' : selectedCategory()}}</h2>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3">
            <div *ngFor="let item of filteredMenuItems()" class="bg-white p-2.5 rounded-xl shadow-sm hover-elevate border border-slate-200 flex flex-row items-stretch gap-2.5 group">
              <div class="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative group-hover:scale-105 transition-transform">
                <span class="text-2xl md:text-3xl select-none">{{item.emoji || '🍱'}}</span>
                <div class="absolute top-1 left-1 bg-white/90 backdrop-blur rounded-md p-0.5 shadow-sm">
                  <span class="w-1.5 h-1.5 rounded-full block" [ngClass]="item.veg ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                </div>
              </div>
              
              <div class="flex-grow flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  <div class="flex items-center justify-between mb-0.5">
                    <div class="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 py-0.2 rounded">⭐ {{item.rating}}</div>
                    <div class="text-[9px] font-semibold text-slate-400">⏱️ {{item.prepTime}}</div>
                  </div>
                  <div class="font-bold text-slate-800 text-xs leading-tight truncate">{{item.name}}</div>
                  <div class="text-[9px] text-slate-500 truncate mt-0.5 font-normal">{{item.description}}</div>
                </div>

                <div class="flex items-end justify-between mt-1">
                  <div class="font-bold text-slate-900 text-xs">₹{{item.variants[0].price}}</div>
                  <button (click)="openCustomizeModal(item)" class="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded-md text-[9px] font-bold border border-rose-200 transition-all">
                    VIEW
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="filteredMenuItems().length === 0" class="text-center py-10">
            <span class="text-4xl">🍽️</span>
            <p class="text-sm font-bold text-slate-500 mt-2">No items found matching your criteria.</p>
          </div>
        </div>

      </main>

      <!-- Floating Cart Bar -->
      <div *ngIf="cart().length > 0" class="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-8 z-40 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl shadow-2xl p-3 sm:px-5 sm:py-3.5 flex items-center justify-between sm:w-80 transition-all border border-rose-500">
        <div>
          <div class="text-[10px] font-semibold text-rose-100 uppercase tracking-wider">{{cart().length}} ITEM<span *ngIf="cart().length>1">S</span></div>
          <div class="text-base sm:text-lg font-bold leading-none mt-0.5">₹{{getTotal()}}</div>
        </div>
        <button (click)="openAccountModal()" class="bg-white text-rose-700 px-4 py-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center gap-1.5 hover:bg-rose-50 shadow-sm transition">
          Checkout <span class="text-sm">➔</span>
        </button>
      </div>

      <!-- Customization Modal -->
      <div *ngIf="customizingItem()" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
        <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl">
          <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
            <div>
              <h3 class="font-bold text-base text-slate-900 leading-tight">{{customizingItem()?.name}}</h3>
              <div class="text-[10px] text-slate-500 font-normal">{{customizingItem()?.category}} • ⭐ {{customizingItem()?.rating}}</div>
            </div>
            <button (click)="closeCustomizeModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-500 transition text-sm">✕</button>
          </div>

          <div class="p-4 sm:p-5 space-y-5 overflow-y-auto modal-content-area scrollbar-none flex-grow bg-slate-50/50">
            <div>
              <div class="flex items-center justify-between mb-2.5">
                <span class="font-bold text-xs text-slate-800">Select Variant</span>
                <span class="text-[9px] font-bold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Required</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div *ngFor="let variant of customizingItem()?.variants" 
                     (click)="selectVariant(variant)"
                     class="p-2.5 rounded-xl border flex flex-col justify-center cursor-pointer transition text-center"
                     [ngClass]="selectedVariant()?.name === variant.name ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white'">
                  <span class="font-semibold text-[11px] text-slate-800">{{variant.name}}</span>
                  <span class="font-bold text-rose-600 text-xs mt-0.5">₹{{variant.price}}</span>
                </div>
              </div>
            </div>

            <div *ngIf="customizingItem()?.addons && (customizingItem()?.addons?.length ?? 0) > 0">
              <div class="flex items-center justify-between mb-2.5">
                <span class="font-bold text-xs text-slate-800">Extras & Addons</span>
                <span class="text-[9px] font-normal text-slate-400 uppercase">Optional</span>
              </div>
              <div class="space-y-2">
                <div *ngFor="let addon of customizingItem()?.addons"
                     (click)="toggleAddon(addon)"
                     class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition"
                     [ngClass]="isAddonSelected(addon) ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-white'">
                  <div class="flex items-center gap-2.5">
                    <div class="w-4 h-4 rounded border flex items-center justify-center text-[10px] text-white font-bold" [ngClass]="isAddonSelected(addon) ? 'border-rose-600 bg-rose-600' : 'border-slate-300 bg-slate-100'">
                      <span *ngIf="isAddonSelected(addon)">✓</span>
                    </div>
                    <span class="font-semibold text-[11px] text-slate-700">{{addon.name}}</span>
                  </div>
                  <span class="font-bold text-rose-600 text-[11px]">+₹{{addon.price}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between sticky bottom-0 rounded-b-3xl">
            <div>
              <div class="text-[9px] uppercase font-normal text-slate-400">Total Item Price</div>
              <div class="text-xl sm:text-2xl font-bold text-slate-900 leading-none mt-0.5">₹{{calculateModalTotal()}}</div>
            </div>
            <button (click)="addCustomizedItemToCart()" class="bg-rose-600 hover:bg-rose-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-[11px] sm:text-xs shadow-md shadow-rose-600/30 transition">
              Add Item
            </button>
          </div>
        </div>
      </div>

      <!-- Account Modal -->
      <div *ngIf="showAccountModal()" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col">
          <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div>
              <h3 class="font-bold text-sm sm:text-base text-slate-900">
                {{ currentUser() ? 'My Account' : (authMode() === 'login' ? 'Welcome Back' : 'Create Account') }}
              </h3>
            </div>
            <button (click)="closeAccountModal()" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">✕</button>
          </div>

          <div *ngIf="!currentUser()" class="p-4 sm:p-5 space-y-4">
            <div class="flex bg-slate-100 p-1 rounded-xl">
              <button (click)="authMode.set('login')" [ngClass]="{'bg-white text-slate-900 shadow-sm': authMode() === 'login', 'text-slate-500': authMode() !== 'login'}" class="flex-1 py-2 rounded-lg font-bold text-[11px] transition">Sign In</button>
              <button (click)="authMode.set('signup')" [ngClass]="{'bg-white text-slate-900 shadow-sm': authMode() === 'signup', 'text-slate-500': authMode() !== 'signup'}" class="flex-1 py-2 rounded-lg font-bold text-[11px] transition">Register</button>
            </div>

            <div *ngIf="authMode() === 'login'" class="space-y-3">
              <input type="text" [ngModel]="loginForm.identifier" (ngModelChange)="loginForm.identifier = $event" placeholder="Email or Phone" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none">
              <input type="password" [ngModel]="loginForm.password" (ngModelChange)="loginForm.password = $event" placeholder="Password" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none">
              <button (click)="loginExistingUser()" class="w-full bg-rose-600 text-white py-3 rounded-xl font-bold text-[11px] shadow-md shadow-rose-600/20">Sign In</button>
            </div>
            
            <div *ngIf="authMode() === 'signup'" class="space-y-3">
              <input type="text" [ngModel]="signupForm.name" (ngModelChange)="signupForm.name = $event" placeholder="Full Name" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
              <input type="text" [ngModel]="signupForm.phone" (ngModelChange)="signupForm.phone = $event" placeholder="Phone Number" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
              <input type="password" [ngModel]="signupForm.password" (ngModelChange)="signupForm.password = $event" placeholder="Password" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
              <button (click)="registerNewUser()" class="w-full bg-rose-600 text-white py-3 rounded-xl font-bold text-[11px] shadow-md shadow-rose-600/20">Create Account</button>
            </div>
          </div>

          <div *ngIf="currentUser()" class="p-4 sm:p-5 space-y-4">
            <div class="bg-rose-50 p-3 rounded-2xl flex items-center gap-3 border border-rose-100">
              <div class="w-10 h-10 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-lg">{{currentUser()?.name?.charAt(0)}}</div>
              <div>
                <div class="font-bold text-sm text-slate-900">{{currentUser()?.name}}</div>
                <div class="text-[10px] text-slate-500">{{currentUser()?.phone}}</div>
              </div>
            </div>
            <button (click)="logoutUser()" class="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-[11px]">Sign Out</button>
          </div>
        </div>
      </div>

      <!-- Location Modal -->
      <div *ngIf="showLocationModal()" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md transition-opacity duration-300">
        <div class="bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-transform duration-300 translate-y-0">
          <div class="px-6 pt-6 pb-4 flex items-start justify-between border-b border-slate-100">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900 tracking-tight">Change Location</h2>
                <p class="text-xs sm:text-sm text-slate-500 font-normal">Select delivery address to check availability</p>
              </div>
            </div>
            <button (click)="closeLocationModal()" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition focus:outline-none">
              ✕
            </button>
          </div>

          <div class="p-6 overflow-y-auto space-y-5 flex-1">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">🔍</span>
              <input type="text" [ngModel]="locationSearchQuery" (ngModelChange)="locationSearchQuery = $event" placeholder="Search area, street name, or landmark..." class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition">
            </div>

            <div class="bg-gradient-to-r from-rose-50/80 to-pink-50/50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/30 flex-shrink-0">📍</div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900">Get Current Location</h3>
                  <p class="text-xs text-slate-500">Using GPS / Location Services</p>
                </div>
              </div>
              <button (click)="detectCurrentGPSLocation()" class="text-rose-600 font-bold text-sm hover:text-rose-700 flex items-center gap-1 bg-white px-3.5 py-2 rounded-xl shadow-sm border border-rose-100 hover:bg-rose-50 transition">
                {{ gpsButtonText() }} &rarr;
              </button>
            </div>

            <div class="space-y-3">
              <label class="text-xs font-bold tracking-wider text-slate-400 uppercase">Saved Addresses</label>
              <div class="space-y-2.5">
                <div (click)="selectAddress('Flat 402, Sunshine Heights, Near Central Park')" class="address-card p-4 rounded-2xl border transition shadow-sm hover:shadow bg-white flex items-center justify-between cursor-pointer" [ngClass]="currentSelectedAddress() === 'Flat 402, Sunshine Heights, Near Central Park' ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200/80 hover:border-slate-300'">
                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mt-0.5 flex-shrink-0">🏠</div>
                    <div>
                      <h4 class="text-sm font-bold text-slate-900">Home</h4>
                      <p class="text-xs text-slate-500 font-normal mt-0.5">Flat 402, Sunshine Heights, Near Central Park</p>
                    </div>
                  </div>
                  <button (click)="selectAddress('Flat 402, Sunshine Heights, Near Central Park'); $event.stopPropagation();" class="select-btn text-rose-600 hover:text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition">Select</button>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <div class="text-xs font-semibold text-slate-500 truncate max-w-[240px]">
              Selected: <span class="text-slate-900 font-bold">{{ currentSelectedAddress() || 'None' }}</span>
            </div>
            <button (click)="confirmLocationModal()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition active:scale-95 text-sm">
              Done
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="toastMessage()" class="fixed top-16 right-4 sm:top-20 sm:right-6 z-[60] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-in fade-in">
        <span>✅</span> {{toastMessage()}}
      </div>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 mt-10 pt-10 pb-12 px-4 lg:px-8 text-slate-600">
        <div class="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
          <div class="flex flex-col items-center space-y-1">
            <span class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Hunger<span class="text-rose-600">Fuel</span></span>
            <p class="text-xs sm:text-sm text-slate-400 font-normal">AI Powered Quick Kitchen</p>
          </div>
          <div class="space-y-1.5 text-xs sm:text-sm text-slate-500 max-w-xl font-medium">
            <p>Shop No. 01, Kumbhavati Niwas, Landmark - Swagat Hall, Carter Rd Number 5, Borivali East, Mumbai</p>
            <div class="flex justify-center gap-4 pt-1 font-bold text-slate-600 text-xs sm:text-sm">
              <a href="tel:8828931694">📞 8828931694</a>
              <a href="mailto:info@hungerfuel.in">✉️ info@hungerfuel.in</a>
            </div>
          </div>
          <div class="text-xs sm:text-sm text-slate-400 font-medium pt-2 border-t border-slate-100 w-full max-w-md">
            © 2026 Hunger Fuel · Built with AI Precision
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    .scrollbar-none::-webkit-scrollbar { display: none; }
    .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
    .smooth-scroll { scroll-behavior: smooth; }
    .hover-elevate { transition: all 0.2s ease-in-out; }
    .hover-elevate:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08); }
    @media (max-height: 700px) { .modal-content-area { max-height: 65vh !important; } }
  `]
})
export class App implements OnInit, OnDestroy {
  currentLocation = signal<string>("Select Location");
  currentUser = signal<User | null>(null);
  authMode = signal<string>('login');
  showAccountModal = signal<boolean>(false);
  showLocationModal = signal<boolean>(false);
  currentSelectedAddress = signal<string>('None');
  locationSearchQuery = '';
  gpsButtonText = signal<string>('Enable');
  activeSlideIndex = signal<number>(0);
  private intervalId: any;

  sliderBanners: Banner[] = [
    { tag: 'CRISPY WAFFLES', title: 'Freshly Baked Waffles & Nutella Treats', subtitle: 'Indulge in our signature Dark Fantasy & Lotus Biscoff waffles starting at just ₹60.', code: 'WELCOME50', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80' },
    { tag: 'TRADITIONAL KULFIS', title: 'Creamy Malai & Alphonso Mango Kulfis', subtitle: 'Beat the heat with our authentic rich and creamy traditional kulfis.', code: 'FLAT20', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
    { tag: 'THICK SHAKES & COMBOS', title: 'Refreshing Shakes & Family Combos', subtitle: 'Grab delicious mango shakes, mojitos, and special dessert combos delivered hot.', code: 'AIKITCHEN', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80' }
  ];

  offersList: Offer[] = [
    { title: '25% Discount offer', subtitle: 'Use code WELCOME50 on ₹200+', code: 'WELCOME50' },
    { title: 'Flat ₹100 Off', subtitle: 'On your first 3 gourmet orders', code: 'FLAT20' },
    { title: 'Free Delivery', subtitle: 'On all orders above ₹350', code: 'WELCOME50' },
    { title: 'AI Midnight Treat', subtitle: 'Extra 15% off using code AIKITCHEN', code: 'AIKITCHEN' },
    { title: 'Special Waffle Deal', subtitle: 'Buy 1 Get 1 on selected desserts', code: 'WELCOME50' }
  ];

  categories: string[] = ["Waffles", "Maggie", "Kulfis", "Bowl Cake", "Pancakes", "Hot Brownie", "Bomboloni", "Shakes", "Mojito", "Sides", "Fruite Shots", "Combos"];

  categoryImages: { [key: string]: string } = {
    "Waffles": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&q=80",
    "Maggie": "https://images.unsplash.com/photo-1612927601101-4537b42c48d9?w=200&q=80",
    "Kulfis": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80",
    "Bowl Cake": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=80",
    "Pancakes": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80",
    "Hot Brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=80",
    "Bomboloni": "https://images.unsplash.com/photo-1621236378699-8599fb6c480c?w=200&q=80",
    "Shakes": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&q=80",
    "Mojito": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80",
    "Sides": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&q=80",
    "Fruite Shots": "https://images.unsplash.com/photo-1546173159-315724a31696?w=200&q=80",
    "Combos": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80"
  };

  standardAddons: Addon[] = [
    { id: 'st1', name: 'Extra Dip / Sauce', price: 20 },
    { id: 'st2', name: 'Extra Butter', price: 25 }
  ];

  waffleAddons: Addon[] = [
    { id: 'w1', name: 'Kitkat Crunch', price: 30 },
    { id: 'w2', name: 'Oreo Crush', price: 30 },
    { id: 'w3', name: 'Nutella Drizzle', price: 40 }
  ];

  menuItems: MenuItem[] = [
    // Waffles
    { id: 301, name: "Dark Fantasy Waffle", category: "Waffles", rating: 4.7, veg: true, emoji: "🧇", description: "Dark chocolate crispy waffle", prepTime: "~12 min", variants: [{name: "Regular", price: 60}, {name: "Large", price: 110}], addons: this.waffleAddons },
    { id: 302, name: "Milk Fantasy Waffle", category: "Waffles", rating: 4.7, veg: true, emoji: "🧇", description: "Milk chocolate waffle", prepTime: "~12 min", variants: [{name: "Regular", price: 60}, {name: "Large", price: 110}], addons: this.waffleAddons },
    { id: 303, name: "White Fantasy Waffle", category: "Waffles", rating: 4.6, veg: true, emoji: "🧇", description: "White chocolate crunch", prepTime: "~12 min", variants: [{name: "Regular", price: 60}, {name: "Large", price: 110}], addons: this.waffleAddons },
    { id: 304, name: "Triple Chocolate Waffle", category: "Waffles", rating: 4.9, veg: true, emoji: "🧇", description: "Dark, milk & white chocolate mix", prepTime: "~12 min", variants: [{name: "Regular", price: 100}, {name: "Large", price: 170}], addons: this.waffleAddons },
    { id: 305, name: "Nutella Classic Waffle", category: "Waffles", rating: 4.9, veg: true, emoji: "🧇", description: "Pure Nutella spread waffle", prepTime: "~12 min", variants: [{name: "Regular", price: 110}, {name: "Large", price: 180}], addons: this.waffleAddons },
    { id: 306, name: "Nutella Banana Waffle", category: "Waffles", rating: 4.8, veg: true, emoji: "🍌", description: "Nutella with fresh banana slices", prepTime: "~14 min", variants: [{name: "Regular", price: 120}, {name: "Large", price: 190}], addons: this.waffleAddons },
    { id: 307, name: "Red Velvet Waffle", category: "Waffles", rating: 4.8, veg: true, emoji: "❤️", description: "Red velvet batter with cream cheese", prepTime: "~12 min", variants: [{name: "Regular", price: 100}, {name: "Large", price: 170}], addons: this.waffleAddons },
    { id: 308, name: "Coffee Mocha Waffle", category: "Waffles", rating: 4.7, veg: true, emoji: "☕", description: "Coffee infused chocolate crunch", prepTime: "~12 min", variants: [{name: "Regular", price: 90}, {name: "Large", price: 160}], addons: this.waffleAddons },
    { id: 309, name: "Almond Crunch Waffle", category: "Waffles", rating: 4.8, veg: true, emoji: "🌰", description: "Roasted almond flakes & chocolate", prepTime: "~12 min", variants: [{name: "Regular", price: 110}, {name: "Large", price: 180}], addons: this.waffleAddons },
    { id: 310, name: "Hazelnut Blast Waffle", category: "Waffles", rating: 4.9, veg: true, emoji: "🍫", description: "Rich premium hazelnut spread", prepTime: "~12 min", variants: [{name: "Regular", price: 120}, {name: "Large", price: 190}], addons: this.waffleAddons },
    { id: 311, name: "Oreo Cookie Waffle", category: "Waffles", rating: 4.7, veg: true, emoji: "🍪", description: "Oreo crumbs with white chocolate", prepTime: "~12 min", variants: [{name: "Regular", price: 90}, {name: "Large", price: 160}], addons: this.waffleAddons },
    { id: 312, name: "Kitkat Crunchy Waffle", category: "Waffles", rating: 4.8, veg: true, emoji: "🍫", description: "Kitkat fingers with chocolate glaze", prepTime: "~12 min", variants: [{name: "Regular", price: 100}, {name: "Large", price: 170}], addons: this.waffleAddons },
    { id: 313, name: "Snickers Peanut Waffle", category: "Waffles", rating: 4.8, veg: true, emoji: "🥜", description: "Caramel, peanuts and chocolate", prepTime: "~12 min", variants: [{name: "Regular", price: 100}, {name: "Large", price: 170}], addons: this.waffleAddons },
    { id: 314, name: "Caramel Butterscotch Waffle", category: "Waffles", rating: 4.7, veg: true, emoji: "🍮", description: "Butterscotch crunch with caramel", prepTime: "~12 min", variants: [{name: "Regular", price: 90}, {name: "Large", price: 160}], addons: this.waffleAddons },
    { id: 315, name: "Honey Butter Waffle", category: "Waffles", rating: 4.6, veg: true, emoji: "🍯", description: "Classic melted butter & honey", prepTime: "~10 min", variants: [{name: "Regular", price: 70}, {name: "Large", price: 120}], addons: this.waffleAddons },
    { id: 316, name: "Blueberry Cream Cheese Waffle", category: "Waffles", rating: 4.9, veg: true, emoji: "🫐", description: "Wild blueberry compote & cream", prepTime: "~14 min", variants: [{name: "Regular", price: 120}, {name: "Large", price: 190}], addons: this.waffleAddons },
    { id: 317, name: "Strawberry Bliss Waffle", category: "Waffles", rating: 4.8, veg: true, emoji: "🍓", description: "Fresh strawberry compote glaze", prepTime: "~14 min", variants: [{name: "Regular", price: 120}, {name: "Large", price: 190}], addons: this.waffleAddons },
    { id: 318, name: "Mango Magic Waffle", category: "Waffles", rating: 4.8, veg: true, emoji: "🥭", description: "Alphonso mango pulp & cream", prepTime: "~14 min", variants: [{name: "Regular", price: 120}, {name: "Large", price: 190}], addons: this.waffleAddons },
    { id: 319, name: "Dark & White Marble Waffle", category: "Waffles", rating: 4.7, veg: true, emoji: "🧇", description: "Dual chocolate marble drizzle", prepTime: "~12 min", variants: [{name: "Regular", price: 90}, {name: "Large", price: 160}], addons: this.waffleAddons },
    { id: 320, name: "Crunchy Peanut Butter Waffle", category: "Waffles", rating: 4.6, veg: true, emoji: "🥜", description: "Thick crunchy peanut butter", prepTime: "~12 min", variants: [{name: "Regular", price: 90}, {name: "Large", price: 160}], addons: this.waffleAddons },
    { id: 321, name: "Lotus Biscoff Waffle", category: "Waffles", rating: 5.0, veg: true, emoji: "🍪", description: "Lotus Biscoff spread & biscuit", prepTime: "~15 min", variants: [{name: "Regular", price: 120}, {name: "Large", price: 190}], addons: this.waffleAddons },

    // Maggie
    { id: 901, name: "Plain Butter Maggie", category: "Maggie", rating: 4.6, veg: true, emoji: "🍜", description: "Classic hot maggi with melted butter", prepTime: "~8 min", variants: [{name: "Standard", price: 50}], addons: this.standardAddons },
    { id: 902, name: "Cheese Maggie", category: "Maggie", rating: 4.8, veg: true, emoji: "🍜", description: "Loaded with melted cheese slice", prepTime: "~10 min", variants: [{name: "Standard", price: 75}], addons: this.standardAddons },
    { id: 903, name: "Peri Peri Cheese Maggie", category: "Maggie", rating: 4.9, veg: true, emoji: "🌶️", description: "Spicy peri peri twist with cheese", prepTime: "~10 min", variants: [{name: "Standard", price: 90}], addons: this.standardAddons },
    { id: 904, name: "Corn & Cheese Maggie", category: "Maggie", rating: 4.8, veg: true, emoji: "🌽", description: "Sweet corn kernels with gooey cheese", prepTime: "~10 min", variants: [{name: "Standard", price: 90}], addons: this.standardAddons },
    { id: 905, name: "Veggie Loaded Masala Maggie", category: "Maggie", rating: 4.7, veg: true, emoji: "🫛", description: "Loaded with garden fresh veggies", prepTime: "~10 min", variants: [{name: "Standard", price: 80}], addons: this.standardAddons },

    // Kulfis
    { id: 201, name: "Malai Kulfi", category: "Kulfis", rating: 4.8, veg: true, emoji: "🍦", description: "Traditional rich creamy malai kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 40}], addons: [] },
    { id: 202, name: "Paan Kulfi", category: "Kulfis", rating: 4.7, veg: true, emoji: "🍃", description: "Refreshing traditional meetha paan flavor", prepTime: "~5 min", variants: [{name: "Standard", price: 45}], addons: [] },
    { id: 203, name: "Chocolate Kulfi", category: "Kulfis", rating: 4.7, veg: true, emoji: "🍫", description: "Chocolaty twist to royal kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 45}], addons: [] },
    { id: 204, name: "Roasted Almond Kulfi", category: "Kulfis", rating: 4.9, veg: true, emoji: "🌰", description: "Crunchy roasted almonds in kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 50}], addons: [] },
    { id: 205, name: "Sitaphal Kulfi", category: "Kulfis", rating: 4.9, veg: true, emoji: "🍈", description: "Rich custard apple pulp kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 50}], addons: [] },
    { id: 206, name: "Anjeer (Fig) Kulfi", category: "Kulfis", rating: 4.8, veg: true, emoji: "🌰", description: "Dry fruit fig kulfi delicacy", prepTime: "~5 min", variants: [{name: "Standard", price: 50}], addons: [] },
    { id: 207, name: "Black Currant Kulfi", category: "Kulfis", rating: 4.8, veg: true, emoji: "🍇", description: "Sweet and tangy black currant", prepTime: "~5 min", variants: [{name: "Standard", price: 45}], addons: [] },
    { id: 208, name: "Butterscotch Kulfi", category: "Kulfis", rating: 4.7, veg: true, emoji: "🍮", description: "Butterscotch crunch kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 45}], addons: [] },
    { id: 209, name: "Badam Pista Kulfi", category: "Kulfis", rating: 4.8, veg: true, emoji: "🥜", description: "Almonds & pistachios kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 50}], addons: [] },
    { id: 210, name: "Chikoo Kulfi", category: "Kulfis", rating: 4.7, veg: true, emoji: "🍐", description: "Natural sapodilla fruit kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 45}], addons: [] },
    { id: 211, name: "Alphonso Mango Kulfi", category: "Kulfis", rating: 4.9, veg: true, emoji: "🥭", description: "Alphonso mango pulp kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 40}], addons: [] },
    { id: 212, name: "Kesar Pista Kulfi", category: "Kulfis", rating: 4.9, veg: true, emoji: "🍧", description: "Saffron & pistachio traditional kulfi", prepTime: "~5 min", variants: [{name: "Standard", price: 50}], addons: [] },

    // Bowl Cake
    { id: 401, name: "Choco Lava Bowl Cake", category: "Bowl Cake", rating: 4.8, veg: true, emoji: "🧁", description: "Warm molten chocolate cake bowl", prepTime: "~10 min", variants: [{name: "Standard", price: 130}], addons: this.standardAddons },
    { id: 402, name: "Red Velvet Bowl Cake", category: "Bowl Cake", rating: 4.7, veg: true, emoji: "🍰", description: "Red velvet sponge with cream cheese", prepTime: "~10 min", variants: [{name: "Standard", price: 140}], addons: this.standardAddons },
    { id: 403, name: "Nutella Fudge Bowl Cake", category: "Bowl Cake", rating: 4.9, veg: true, emoji: "🎂", description: "Moist sponge loaded with Nutella", prepTime: "~10 min", variants: [{name: "Standard", price: 160}], addons: this.standardAddons },

    // Pancakes
    { id: 501, name: "Classic Honey Pancakes", category: "Pancakes", rating: 4.7, veg: true, emoji: "🥞", description: "Fluffy pancakes with maple syrup", prepTime: "~10 min", variants: [{name: "Standard", price: 110}], addons: this.standardAddons },
    { id: 502, name: "Nutella Stacks Pancakes", category: "Pancakes", rating: 4.9, veg: true, emoji: "🥞", description: "Pancake stacks smothered in Nutella", prepTime: "~12 min", variants: [{name: "Standard", price: 150}], addons: this.standardAddons },
    { id: 503, name: "Blueberry Compote Pancakes", category: "Pancakes", rating: 4.8, veg: true, emoji: "🥞", description: "Fluffy pancakes with blueberry syrup", prepTime: "~12 min", variants: [{name: "Standard", price: 140}], addons: this.standardAddons },

    // Hot Brownie
    { id: 601, name: "Sizzling Brownie with Ice Cream", category: "Hot Brownie", rating: 5.0, veg: true, emoji: "🍫", description: "Hot fudge brownie served with vanilla scoop", prepTime: "~8 min", variants: [{name: "Standard", price: 150}], addons: this.standardAddons },
    { id: 602, name: "Walnut Fudge Brownie", category: "Hot Brownie", rating: 4.8, veg: true, emoji: "🍫", description: "Rich chocolate brownie with walnuts", prepTime: "~8 min", variants: [{name: "Standard", price: 110}], addons: this.standardAddons },
    { id: 603, name: "Nutella Sizzling Brownie", category: "Hot Brownie", rating: 4.9, veg: true, emoji: "🌋", description: "Sizzling brownie drenched in Nutella", prepTime: "~10 min", variants: [{name: "Standard", price: 180}], addons: this.standardAddons },

    // Bomboloni
    { id: 651, name: "Nutella Filled Bomboloni", category: "Bomboloni", rating: 4.9, veg: true, emoji: "🍩", description: "Italian doughnuts filled with Nutella", prepTime: "~10 min", variants: [{name: "Standard", price: 90}], addons: [] },
    { id: 652, name: "Vanilla Custard Bomboloni", category: "Bomboloni", rating: 4.7, veg: true, emoji: "🍩", description: "Fluffy doughnut with vanilla custard", prepTime: "~10 min", variants: [{name: "Standard", price: 80}], addons: [] },
    { id: 653, name: "Biscoff Bomboloni", category: "Bomboloni", rating: 5.0, veg: true, emoji: "🍩", description: "Filled with creamy Lotus Biscoff", prepTime: "~10 min", variants: [{name: "Standard", price: 100}], addons: [] },

    // Shakes
    { id: 701, name: "Cold Coffee Shake", category: "Shakes", rating: 4.8, veg: true, emoji: "☕", description: "Rich blended creamy cold coffee", prepTime: "~6 min", variants: [{name: "Standard", price: 110}], addons: [] },
    { id: 702, name: "Nutella Thick Shake", category: "Shakes", rating: 5.0, veg: true, emoji: "🧋", description: "Blended with pure Nutella & ice cream", prepTime: "~8 min", variants: [{name: "Standard", price: 190}], addons: [] },
    { id: 703, name: "Kitkat Shake", category: "Shakes", rating: 4.8, veg: true, emoji: "🍫", description: "Thick shake blended with Kitkat", prepTime: "~6 min", variants: [{name: "Standard", price: 140}], addons: [] },
    { id: 704, name: "Oreo Cookie Shake", category: "Shakes", rating: 4.7, veg: true, emoji: "🍪", description: "Cookies and cream thick shake", prepTime: "~6 min", variants: [{name: "Standard", price: 130}], addons: [] },
    { id: 705, name: "Alphonso Mango Shake", category: "Shakes", rating: 4.9, veg: true, emoji: "🥭", description: "Real Alphonso mango pulp shake", prepTime: "~6 min", variants: [{name: "Standard", price: 150}], addons: [] },
    { id: 706, name: "Strawberry Thick Shake", category: "Shakes", rating: 4.7, veg: true, emoji: "🍓", description: "Creamy fresh strawberry milkshake", prepTime: "~6 min", variants: [{name: "Standard", price: 130}], addons: [] },
    { id: 707, name: "Belgian Dark Chocolate Shake", category: "Shakes", rating: 4.9, veg: true, emoji: "🍫", description: "Deep dark Belgian chocolate shake", prepTime: "~8 min", variants: [{name: "Standard", price: 160}], addons: [] },

    // Mojito
    { id: 801, name: "Classic Mint Mojito", category: "Mojito", rating: 4.7, veg: true, emoji: "🍹", description: "Refreshing mint & lime sparkler", prepTime: "~5 min", variants: [{name: "Standard", price: 120}], addons: [] },
    { id: 802, name: "Blue Lagoon Mojito", category: "Mojito", rating: 4.8, veg: true, emoji: "🧊", description: "Blue curacao sparkling cooler", prepTime: "~5 min", variants: [{name: "Standard", price: 130}], addons: [] },
    { id: 803, name: "Green Apple Mojito", category: "Mojito", rating: 4.7, veg: true, emoji: "🍏", description: "Crisp green apple soda fizz", prepTime: "~5 min", variants: [{name: "Standard", price: 120}], addons: [] },
    { id: 804, name: "Watermelon Cooler Mojito", category: "Mojito", rating: 4.8, veg: true, emoji: "🍉", description: "Juicy watermelon sparkle", prepTime: "~5 min", variants: [{name: "Standard", price: 120}], addons: [] },

    // Sides
    { id: 1101, name: "Classic Salted Fries", category: "Sides", rating: 4.6, veg: true, emoji: "🍟", description: "Crispy golden french fries", prepTime: "~8 min", variants: [{name: "Regular", price: 90}, {name: "Large", price: 130}], addons: this.standardAddons },
    { id: 1102, name: "Peri Peri Fries", category: "Sides", rating: 4.8, veg: true, emoji: "🍟", description: "Tossed in fiery peri peri spice", prepTime: "~8 min", variants: [{name: "Regular", price: 100}, {name: "Large", price: 140}], addons: this.standardAddons },
    { id: 1103, name: "Cheese Loaded Fries", category: "Sides", rating: 4.9, veg: true, emoji: "🧀", description: "Golden fries drowned in cheese", prepTime: "~10 min", variants: [{name: "Regular", price: 140}, {name: "Large", price: 190}], addons: this.standardAddons },
    { id: 1104, name: "Cheesy Garlic Bread", category: "Sides", rating: 4.8, veg: true, emoji: "🥖", description: "Baked garlic bread with cheese", prepTime: "~10 min", variants: [{name: "Standard", price: 120}], addons: this.standardAddons },

    // Fruite Shots
    { id: 1201, name: "Fresh Fruit Shot Trio", category: "Fruite Shots", rating: 4.8, veg: true, emoji: "🍓", description: "Seasonal fresh fruit cups", prepTime: "~5 min", variants: [{name: "Standard", price: 99}], addons: [] },
    { id: 1202, name: "Mango Cream Shot", category: "Fruite Shots", rating: 4.9, veg: true, emoji: "🥭", description: "Fresh mango cubes with whipped cream", prepTime: "~5 min", variants: [{name: "Standard", price: 110}], addons: [] },

    // Combos
    { id: 101, name: "Gourmet Waffle Combo", category: "Combos", rating: 4.9, veg: true, emoji: "🎉", description: "Any 2 signature waffles + 2 shakes", prepTime: "~15 min", variants: [{name: "Standard", price: 399}], addons: this.standardAddons },
    { id: 102, name: "Midnight Sweet Treat Combo", category: "Combos", rating: 4.9, veg: true, emoji: "🌙", description: "1 Sizzling Brownie + 2 Kulfis + 1 Mojito", prepTime: "~12 min", variants: [{name: "Standard", price: 299}], addons: this.standardAddons }
  ];

  selectedCategory = signal<string>('All');
  vegOnly = signal<boolean>(false);
  searchQuery = signal<string>('');
  toastMessage = signal<string | null>(null);

  customizingItem = signal<MenuItem | null>(null);
  selectedVariant = signal<Variant | null>(null);
  selectedAddons = signal<Addon[]>([]);
  cart = signal<CartItem[]>([]);

  signupForm = { name: '', phone: '', password: '' };
  loginForm = { identifier: '', password: '' };

  ngOnInit() {
    this.intervalId = setInterval(() => {
      const swiper = document.getElementById('heroSwiper');
      if (swiper) {
        const slideWidth = swiper.clientWidth;
        const maxScroll = swiper.scrollWidth - swiper.clientWidth;
        if (swiper.scrollLeft >= maxScroll - 10) {
          swiper.scrollTo({ left: 0, behavior: 'smooth' });
          this.activeSlideIndex.set(0);
        } else {
          swiper.scrollBy({ left: slideWidth, behavior: 'smooth' });
          const newIdx = Math.min(this.sliderBanners.length - 1, Math.floor((swiper.scrollLeft + slideWidth) / slideWidth));
          this.activeSlideIndex.set(newIdx);
        }
      }
    }, 4500);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  filteredMenuItems = computed(() => {
    const cat = this.selectedCategory();
    const veg = this.vegOnly();
    const query = this.searchQuery().toLowerCase().trim();

    return this.menuItems.filter(item => {
      const matchesCat = cat === 'All' || item.category === cat;
      const matchesVeg = !veg || item.veg === true;
      const matchesSearch = !query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      return matchesCat && matchesVeg && matchesSearch;
    });
  });

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) this.toastMessage.set(null);
    }, 2500);
  }

  applySliderCode(code: string) {
    this.showToast("Code " + code + " applied to session!");
  }

  applyOfferCode(offer: Offer) {
    this.showToast(offer.code + " Copied! Use at checkout.");
  }

  openLocationModal() { this.showLocationModal.set(true); }
  closeLocationModal() { this.showLocationModal.set(false); }
  openAccountModal() { this.showAccountModal.set(true); }
  closeAccountModal() { this.showAccountModal.set(false); }

  selectAddress(address: string) {
    this.currentSelectedAddress.set(address);
  }

  detectCurrentGPSLocation() {
    this.gpsButtonText.set('Locating...');
    setTimeout(() => {
      this.currentSelectedAddress.set('Current GPS Location (MG Road, Pune)');
      this.gpsButtonText.set('Enabled ✓');
      setTimeout(() => { this.gpsButtonText.set('Enable'); }, 2000);
    }, 1000);
  }

  confirmLocationModal() {
    const addr = this.currentSelectedAddress();
    if (addr && addr !== 'None') {
      this.currentLocation.set(addr);
      this.showToast("Delivery location set!");
      this.closeLocationModal();
    } else {
      this.showToast("Please select an address.");
    }
  }

  registerNewUser() {
    if (!this.signupForm.name || !this.signupForm.phone) {
      this.showToast("Fill required fields");
      return;
    }
    this.currentUser.set({ name: this.signupForm.name, phone: this.signupForm.phone });
    this.showToast("Welcome, " + this.currentUser()?.name);
    this.signupForm = { name: '', phone: '', password: '' };
    this.closeAccountModal();
  }

  loginExistingUser() {
    if (!this.loginForm.identifier) return;
    this.currentUser.set({ name: 'Demo User', phone: this.loginForm.identifier });
    this.showToast("Signed in successfully");
    this.closeAccountModal();
  }

  logoutUser() {
    this.currentUser.set(null);
    this.showToast("Signed out.");
    this.closeAccountModal();
  }

  selectCategory(cat: string) { this.selectedCategory.set(cat); }

  openCustomizeModal(item: MenuItem) {
    this.customizingItem.set(item);
    this.selectedVariant.set(item.variants[0]);
    this.selectedAddons.set([]);
  }

  closeCustomizeModal() {
    this.customizingItem.set(null);
    this.selectedVariant.set(null);
    this.selectedAddons.set([]);
  }

  selectVariant(v: Variant) { this.selectedVariant.set(v); }
  isAddonSelected(a: Addon): boolean { return this.selectedAddons().some(x => x.id === a.id); }

  toggleAddon(a: Addon) {
    const current = [...this.selectedAddons()];
    const idx = current.findIndex(x => x.id === a.id);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(a);
    }
    this.selectedAddons.set(current);
  }

  calculateModalTotal(): number {
    const item = this.customizingItem();
    const variant = this.selectedVariant();
    if (!item || !variant) return 0;
    let total = variant.price;
    this.selectedAddons().forEach(a => total += a.price);
    return total;
  }

  addCustomizedItemToCart() {
    const item = this.customizingItem();
    const variant = this.selectedVariant();
    if (!item || !variant) return;

    const addons = this.selectedAddons();
    const addonIds = addons.map(a => a.id).sort().join('-');
    const cartKey = item.id + '-' + variant.name + '-' + addonIds;

    const currentCart = [...this.cart()];
    const existing = currentCart.find(c => c.cartKey === cartKey);
    if (existing) {
      existing.qty += 1;
    } else {
      currentCart.push({
        cartKey: cartKey,
        id: item.id,
        name: item.name,
        selectedVariant: { ...variant },
        selectedAddons: [...addons],
        qty: 1
      });
    }
    this.cart.set(currentCart);
    this.showToast(item.name + " added!");
    this.closeCustomizeModal();
  }

  getTotal(): number {
    return this.cart().reduce((total, item) => {
      const base = item.selectedVariant.price;
      const addons = item.selectedAddons.reduce((s, a) => s + a.price, 0);
      return total + ((base + addons) * item.qty);
    }, 0);
  }
}







