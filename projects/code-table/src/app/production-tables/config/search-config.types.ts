export interface SearchField {
  type: 'text' | 'select' | 'date' | 'checkbox';
  label: string;
  field: string;
  options?: string[];
  defaultValue?: any;
}

export interface TableSearchConfig {
  enabled: boolean;
  fields: SearchField[];
}

export interface SearchCriteriaResponse {
  serviceGroups: string[];
  capIds: string[];
  capTypes: string[];
  serviceCodes: string[];
}

export interface SearchRequest {
  tableName: string;
  criteria: Record<string, any>;
} 