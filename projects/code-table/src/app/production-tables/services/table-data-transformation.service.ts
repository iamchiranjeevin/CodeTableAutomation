import { Injectable } from '@angular/core';
import { TableConfigService } from './table-config.service';
import { format, parseISO, isValid } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class TableDataTransformationService {
  constructor(private tableConfig: TableConfigService) {}
  
  transformApiDataToDisplay(apiTableName: string, tableRows: any[]): any[] {
    if (!tableRows.length) return [];
    
    const columnMappings = this.tableConfig.getColumnMappings(apiTableName);
    const dataTypes = this.tableConfig.getColumnDataTypes(apiTableName);
    const config = this.tableConfig.getConfig(apiTableName);
    
    return tableRows.map(row => {
      const transformedRow: Record<string, any> = {};
      
      Object.keys(row).forEach(apiKey => {
        const displayKey = columnMappings[apiKey] || apiKey;
        let value = row[apiKey];
        
        // Find the column mapping to check for formatters
        const columnMapping = config?.columnMappings.find(m => m.apiName === apiKey);
        
        // Apply formatter if available
        if (columnMapping?.formatter) {
          value = columnMapping.formatter(value);
        } else {
          // Apply formatting based on data type
          const dataType = dataTypes[displayKey];
          if (dataType === 'date' && value) {
            try {
              value = format(parseISO(value), 'MM/dd/yyyy');
            } catch (e) {
              console.warn(`Failed to format date: ${value}`);
            }
          } else if (dataType === 'number' && value !== null && value !== undefined) {
            value = Number(value);
          }
        }
        
        transformedRow[displayKey] = value;
      });
      
      return transformedRow;
    });
  }
  
  transformDisplayDataToApi(apiTableName: string, displayData: any): any {
    const config = this.tableConfig.getConfig(apiTableName);
    if (!config) return displayData;
    
    const apiData: Record<string, any> = {};
    
    // Create reverse mapping (display name to API name)
    const reverseMapping = new Map<string, {apiName: string, dataType: string}>();
    config.columnMappings.forEach(mapping => {
      reverseMapping.set(mapping.displayName, {
        apiName: mapping.apiName,
        dataType: mapping.dataType
      });
    });
    
    // Transform each field
    Object.entries(displayData).forEach(([displayName, value]) => {
      const mapping = reverseMapping.get(displayName);
      if (mapping) {
        let transformedValue = value;
        
        // Transform based on data type
        if (mapping.dataType === 'date' && value) {
          if (value instanceof Date && isValid(value)) {
            transformedValue = format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
          }
        } else if (mapping.dataType === 'number' && value !== null && value !== '') {
          transformedValue = Number(value);
        }
        
        apiData[mapping.apiName] = transformedValue;
      }
    });
    
    return apiData;
  }
} 