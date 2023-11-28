import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  Inject,
  Optional,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { VISIBLE_ITEMS_COUNT } from '../select.module';
import {Item} from "../../item.model";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor, OnDestroy, OnInit, AfterViewInit {
  @Input('items')
  set items(items: Item[]) {
    this._items = items;
    this.filterItems();
  }
  get items(): Item[] {
    return this._items;
  }
  private _items: Item[] = [];

  @Input() visibleItemsCount!: number;
  @Output() valueChanged = new EventEmitter<number>();
  @Output() searchValueChanged = new EventEmitter<string>();

  searchValue: string = '';
  showOptions: boolean = false;
  visibleItems: Array<Item> = [];
  selectedItemId?: number;

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(VISIBLE_ITEMS_COUNT) @Optional() private injectedVisibleItemsCount: number,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.visibleItemsCount = this.visibleItemsCount || this.injectedVisibleItemsCount || 5;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: any): void {
    this.selectedItemId = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSearchInputChange() {
    this.searchValueChanged.emit(this.searchValue);
    this.filterItems();
  }

  selectItem(item: Item) {
    this.selectedItemId = item.id;
    this.showOptions = false;
    this.searchValue = item.name;
    this.filterItems();
    this.valueChanged.emit(this.selectedItemId);
    this.onChange(this.selectedItemId);
    this.onTouched();
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement?.contains(event.target as Node);
    if (!clickedInside) {
      this.showOptions = false;
      this.cdr.detectChanges();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showOptions && event.key === 'Escape') {
      this.showOptions = false;
      this.cdr.detectChanges();
    }
  }


  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  private filterItems() {
    this.visibleItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );

    if (this.visibleItems.length > this.visibleItemsCount) {
      this.visibleItems.length = this.visibleItemsCount;
      this.showOptions = true;
    } else {
      this.showOptions = false;
    }
  }
}
