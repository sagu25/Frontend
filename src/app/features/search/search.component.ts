import { Component, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 1, 1)', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class SearchComponent {
  searchService = inject(SearchService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchQuery = '';
  isFocused = false;

  constructor() {
    // Watch for search activation to focus input
    effect(() => {
      if (this.searchService.isSearchActive()) {
        setTimeout(() => {
          this.searchInput?.nativeElement?.focus();
        }, 100);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchService.setSearchQuery(this.searchQuery);
  }

  onSearchFocus(): void {
    this.isFocused = true;
    this.searchService.isSearchActive.set(true);
  }

  onSearchBlur(): void {
    // Delay to allow click on results
    setTimeout(() => {
      this.isFocused = false;
    }, 200);
  }

  onClearSearch(): void {
    this.searchQuery = '';
    this.searchService.clearSearch();
    this.searchInput?.nativeElement?.focus();
  }

  onResultClick(result: any): void {
    this.searchService.selectResult(result);
    this.searchQuery = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClearSearch();
      this.searchService.isSearchActive.set(false);
    }
  }

  getMatchBadgeText(matchedFields: string[]): string {
    if (matchedFields.includes('title-exact') || matchedFields.includes('title')) {
      return 'Title';
    }
    if (matchedFields.includes('description')) {
      return 'Description';
    }
    if (matchedFields.includes('content')) {
      return 'Content';
    }
    return 'Match';
  }
}
