import { TableSearchConfig } from './search-config.types';

export interface ColumnMapping {
  apiName: string;
  displayName: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  editable?: boolean;
  hidden?: boolean;
  formatter?: (value: any) => any;
}

export interface TableConfig {
  apiName: string;
  displayName: string;
  searchConfig: TableSearchConfig;
  columnMappings: ColumnMapping[];
  hiddenColumns: string[];
  detailsConfig: {
    tabs: string[];
    fieldGroups: Record<string, string[]>;
  };
} 