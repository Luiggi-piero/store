import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  categories: string[] = [];
  categoriesSubscription!: Subscription;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoriesSubscription = this.storeService.getCategories().subscribe({
      next: categoriesResponse => this.categories = categoriesResponse,
      error: error => console.log('Ocurrió un error', error)
    })
  }

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription)
      this.categoriesSubscription.unsubscribe();
  }
}
