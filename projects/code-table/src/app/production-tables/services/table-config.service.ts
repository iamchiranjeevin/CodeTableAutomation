import { Injectable } from '@angular/core';
import { TableConfig } from '../config/table-config.types';
import { TableSearchConfig } from '../config/search-config.types';
import { TABLE_REGISTRY, DISPLAY_TO_API_MAPPING, API_TO_DISPLAY_MAPPING } from '../config/table-registry';
import { SearchConfig, SearchField } from '../shared/types';

@Injectable({
  providedIn: 'root'
})
export class TableConfigService {
  getConfig(tableName: string): TableConfig | undefined {
    const apiName = this.getApiName(tableName);
    return TABLE_REGISTRY[apiName];
  }

  getApiName(displayName: string): string {
    return DISPLAY_TO_API_MAPPING[displayName] || displayName;
  }

  getDisplayName(apiName: string): string {
    return API_TO_DISPLAY_MAPPING[apiName] || apiName;
  }

  getAllDisplayNames(): string[] {
    return Object.values(API_TO_DISPLAY_MAPPING);
  }

  getAllApiNames(): string[] {
    return Object.keys(TABLE_REGISTRY);
  }

  getSearchConfig(tableName: string): TableSearchConfig | undefined {
    const config = this.getConfig(tableName);
    return config?.searchConfig;
  }

  getColumnMappings(tableName: string): Record<string, string> {
    const config = this.getConfig(tableName);
    if (!config) return {};
    
    const mappings: Record<string, string> = {};
    config.columnMappings.forEach(mapping => {
      mappings[mapping.apiName] = mapping.displayName;
    });
    
    return mappings;
  }

  getHiddenColumns(tableName: string): string[] {
    const config = this.getConfig(tableName);
    return config?.hiddenColumns || [];
  }

  getColumnDataTypes(tableName: string): Record<string, string> {
    const config = this.getConfig(tableName);
    if (!config) return {};
    
    const dataTypes: Record<string, string> = {};
    config.columnMappings.forEach(mapping => {
      dataTypes[mapping.displayName] = mapping.dataType;
    });
    
    return dataTypes;
  }

  getDetailsConfig(tableName: string): TableConfig['detailsConfig'] | undefined {
    const config = this.getConfig(tableName);
    return config?.detailsConfig;
  }
} 