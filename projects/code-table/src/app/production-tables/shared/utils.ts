import { ProductionTable } from './types';

export function propsToSet(rows: [], keys: Set<string>) { 
  rows.forEach((row) => {   
    Object.keys(row).forEach(key => keys.add(key));
  });
}
