import { ProductionTable } from './types';

export function propsToSet(tableDetails: ProductionTable, keys: Set<string>) {
  tableDetails.data.forEach(table =>
    Object.keys(table).forEach(key => keys.add(key))
  );
}
