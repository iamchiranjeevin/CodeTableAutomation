import { Injectable } from '@angular/core';
import { format, parseISO, isValid } from 'date-fns';
import { TableConfigService } from './table-config.service';

@Injectable({
  providedIn: 'root'
})
export class DataTransformationService {
  private memoCache = new Map<string, any[]>();
  
  constructor(private tableConfigService: TableConfigService) {}

  transformApiToDisplay(tableName: string, apiData: any[]): any[] {
    if (!apiData?.length) return [];
    
    // Create a cache key based on the table name and a hash of the data
    const cacheKey = `${tableName}-${this.hashData(apiData)}`;
    
    // Return cached result if available
    if (this.memoCache.has(cacheKey)) {
      return this.memoCache.get(cacheKey)!;
    }
    
    const config = this.tableConfigService.getConfig(tableName);
    if (!config) return apiData;
    
    const result = apiData.map(row => {
      const displayRow: Record<string, any> = {};
      
      config.columnMappings.forEach(mapping => {
        if (row[mapping.apiName] !== undefined) {
          let value = row[mapping.apiName];
          
          // Apply formatter if available
          if (mapping.formatter) {
            value = mapping.formatter(value);
          } else if (mapping.dataType === 'date' && value) {
            try {
              value = format(parseISO(value), 'MM/dd/yyyy');
            } catch (e) {
              console.warn(`Failed to format date: ${value}`);
            }
          } else if (mapping.dataType === 'number' && value !== null) {
            value = Number(value);
          }
          
          displayRow[mapping.displayName] = value;
        }
      });
      
      return displayRow;
    });
    
    // Cache the result
    this.memoCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory leaks
    if (this.memoCache.size > 50) {
      const oldestKey = this.memoCache.keys().next().value;
      if (oldestKey !== undefined) {
        this.memoCache.delete(oldestKey);
      }
    }
    
    return result;
  }

  transformDisplayToApi(tableName: string, displayData: any): any {
    const config = this.tableConfigService.getConfig(tableName);
    if (!config) return displayData;
    
    const apiData: Record<string, any> = {};
    
    config.columnMappings.forEach(mapping => {
      const displayKey = mapping.displayName;
      if (displayData[displayKey] !== undefined) {
        let value = displayData[displayKey];
        
        // Reverse any formatting
        if (mapping.dataType === 'date' && value) {
          try {
            // Convert MM/dd/yyyy back to ISO format
            const parts = value.split('/');
            if (parts.length === 3) {
              const date = new Date(parts[2], parts[0] - 1, parts[1]);
              value = date.toISOString().split('T')[0];
            }
          } catch (e) {
            console.warn(`Failed to parse date: ${value}`);
          }
        } else if (mapping.dataType === 'number' && value !== null) {
          value = Number(value);
        }
        
        apiData[mapping.apiName] = value;
      }
    });
    
    return apiData;
  }

  formatDate(date: string | Date | null): string | null {
    if (!date) return null;
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!isValid(dateObj)) return null;
      return format(dateObj, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    } catch (e) {
      console.warn(`Failed to format date: ${date}`);
      return null;
    }
  }

  private hashData(data: any[]): string {
    // Simple hash function for array of objects
    return data.reduce((hash, item) => {
      const itemHash = Object.entries(item)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, val]) => `${key}:${val}`)
        .join('|');
      return hash + itemHash.length;
    }, '').slice(0, 10);
  }
  
  clearCache(): void {
    this.memoCache.clear();
  }
} 