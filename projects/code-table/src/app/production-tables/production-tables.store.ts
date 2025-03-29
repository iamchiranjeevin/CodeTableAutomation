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
  data: any | null;  
  _dynamicDetails: any | null;
}

const initialState: ProductionTablesStore = {
  data: [],
  _dynamicDetails: null,
};

const availableProductionTables: ProductionTable[] = [
  { id: 1, name: 'AAH-AUTH AGENT HOLD', data: [] },
  { id: 2, name: 'CAP- CAP_ THRESHOLD', data: [] }];

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
        switchMap((name) => {
          if (!name) {        
        _appStore.updateProductionTables(availableProductionTables);
        return []; // Return an empty observable array to prevent API call
      }
          return _productionTablesService.getProductionTables(name).pipe(
            tapResponse({
              error: (error: { message: string }) => {
                patchState(store, { data: null });
              },
              next: tableRows => {
                patchState(store, {
                  data: tableRows,
                });
                _appStore.updateProductionTables(
                  availableProductionTables
                );
              },
            })
          );
        })
      )
    ),
    updateDynamicDetails(details: ProductionTableData | null) {
      patchState(store, { _dynamicDetails: details });
      patchState(store, {
        data: store.data()?.map((item: ProductionTableData) =>
          item['ID'] === details?.['ID'] ? details : item
        ),
      });
    },
    updateProdRows(tblRows: any[]){
      patchState(store, { data: tblRows });
      patchState(store, { _dynamicDetails: null });
    },
    getDynamicDetails() {
      return store._dynamicDetails;
    }
  })),
  withHooks(store => ({
    onDestroy() {
      patchState(store, { _dynamicDetails: null });
    },
  }))
);