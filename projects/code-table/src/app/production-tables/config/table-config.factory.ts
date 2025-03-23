import { TableConfig } from './table-config.types';
import { TableSearchConfig } from './search-config.types';

export function createTableConfig(
  apiName: string,
  displayName: string,
  searchConfig: TableSearchConfig,
  columnMappings: TableConfig['columnMappings'],
  hiddenColumns: string[],
  detailsConfig: TableConfig['detailsConfig']
): TableConfig {
  return {
    apiName,
    displayName,
    searchConfig,
    columnMappings,
    hiddenColumns,
    detailsConfig
  };
} 