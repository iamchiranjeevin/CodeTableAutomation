import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { inject } from '@angular/core';
import { ProductionTablesService } from './api/production-tables.service';
import { AppStore } from '../app.store';
import { ProductionTable, ProductionTableData } from './shared/types';

interface ProductionTablesStore {
  data: ProductionTable | null;  // Now storing a single ProductionTable
  _dynamicDetails: ProductionTableData | null;
}

const initialState: ProductionTablesStore = {
  data: null,
  _dynamicDetails: null,
};

export const ProductionTablesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _productionTablesService: inject(ProductionTablesService),
    _appStore: inject(AppStore),
  })),
  withMethods(({ _productionTablesService, _appStore, ...store }) => ({
    getTableDetails() {
      return store.data();
    },
    loadProductionTables: rxMethod<string>(
      pipe(
        switchMap((tableName: string) =>
          _productionTablesService.getProductionTables(tableName).pipe(
            tapResponse({
              error: (error: { message: string }) => {
                console.error(
                  `Error fetching production table for ${tableName}:`,
                  error.message
                );
                patchState(store, { data: null });
              },
              next: (table: ProductionTable) => {
                patchState(store, { data: table });
                _appStore.updateProductionTables([table]); // Store it in AppStore
              },
            })
          )
        )
      )
    ),
    updateDynamicDetails(details: ProductionTableData) {
      patchState(store, { _dynamicDetails: details });
    },
    getDynamicDetails() {
      return store._dynamicDetails;
    },
  })),
  withHooks((store) => ({
    onDestroy() {
      patchState(store, { _dynamicDetails: null });
    },
  }))
);
