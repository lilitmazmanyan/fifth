import {NgModule, InjectionToken, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select.component';

export const VISIBLE_ITEMS_COUNT = new InjectionToken<number>('VISIBLE_ITEMS_COUNT', {
  providedIn: 'root',
  factory: () => 5
});

@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SelectComponent],
})
export class SelectModule {
  static forRoot(config: { visibleItemsCount: number }): ModuleWithProviders<SelectModule> {
    return {
      ngModule: SelectModule,
      providers: [
        {
          provide: VISIBLE_ITEMS_COUNT,
          useValue: config.visibleItemsCount,
        },
      ],
    };
  }
}
