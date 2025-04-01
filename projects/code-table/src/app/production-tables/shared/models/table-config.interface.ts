// projects/code-table/src/app/production-tables/shared/models/table-config.interface.ts

export interface TableFieldConfig {
    apiField: string;          // Field name in API
    displayField?: string;     // Display name (if different from API)
    type: 'string' | 'number' | 'date' | 'boolean' | 'select';
    required?: boolean;
    defaultValue?: any;
    options?: {value: string, label: string}[]; // For select fields
    hidden?: boolean;          // Whether to hide in UI
    readOnly?: boolean;        // Whether field is read-only
    format?: (value: any) => any; // Custom formatter for API submission
  }
  
  export interface TableConfig {
    displayName: string;       // Human-readable table name
    apiName: string;           // API table name
    prefix?: string;           // Prefix to add to API name (e.g., 'MG1_')
    idField: string;           // Primary key field
    fields: Record<string, TableFieldConfig>;
    hiddenColumns: string[];   // Columns to hide in table view
    searchConfig?: {           // Configuration for search dialog
      fields: string[];        // Fields to include in search
      defaultValues?: Record<string, any>;
    };
  }
  
  export interface SearchControl {
    name: string;
    label: string;
    type: string;
    defaultValue?: any;
    options?: {value: string, label: string}[];
  }