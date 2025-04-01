// projects/code-table/src/app/production-tables/shared/services/table-config.service.ts

import { Injectable } from '@angular/core';
import { TableConfig, TableFieldConfig, SearchControl } from '../../shared/models/table-config.interface';

@Injectable({
  providedIn: 'root'
})
export class TableConfigService {
  private tableConfigs: Map<string, TableConfig> = new Map();
  private apiNameToDisplayName: Map<string, string> = new Map();
  
  constructor() {
    this.initializeTableConfigs();
  }
  
  private initializeTableConfigs(): void {
    // Initialize AAH config
    const aahConfig = this.createAAHConfig();
    this.tableConfigs.set(aahConfig.displayName, aahConfig);
    this.apiNameToDisplayName.set(aahConfig.apiName, aahConfig.displayName);
    
    // Initialize CAP Threshold config
    const capConfig = this.createCAPThresholdConfig();
    this.tableConfigs.set(capConfig.displayName, capConfig);
    this.apiNameToDisplayName.set(capConfig.apiName, capConfig.displayName);
    
    // Add more table configs here
  }
  
  getConfigByDisplayName(displayName: string): TableConfig | undefined {
    return this.tableConfigs.get(displayName);
  }
  
  getConfigByApiName(apiName: string): TableConfig | undefined {
    const displayName = this.apiNameToDisplayName.get(apiName);
    if (displayName) {
      return this.tableConfigs.get(displayName);
    }
    return undefined;
  }
  
  getSearchControls(apiTableName: string): SearchControl[] {
    const config = this.getConfigByApiName(apiTableName);
    if (!config || !config.searchConfig) {
      return this.getDefaultSearchControls(apiTableName);
    }
    
    return this.buildSearchControlsFromConfig(config);
  }
  
  private createAAHConfig(): TableConfig {
    return {
      displayName: 'AAH-AUTH AGENT HOLD',
      apiName: 'SSAS_AUTH_AGENT_AND_HOLD',
      prefix: 'MG1_',
      idField: 'ID',
      fields: {
        'ID': {
          apiField: 'ID',
          type: 'number',
          hidden: true,
          format: (value: any) => typeof value === 'string' ? parseInt(value) : value
        },
        'SERVICE_GRP': {
          apiField: 'SERVICE_GRP',
          displayField: 'SERVICE_GROUP',
          type: 'string',
          defaultValue: ''
        },
        'AUTH_AGENT_TYPE': {
          apiField: 'AUTH_AGENT_TYPE',
          type: 'string',
          required: true,
          defaultValue: ''
        },
        'AUTH_AGENT_NAME': {
          apiField: 'AUTH_AGENT_NAME',
          type: 'string',
          defaultValue: ''
        },
        'AUTH_AGENT_ID': {
          apiField: 'AUTH_AGENT_ID',
          type: 'string',
          defaultValue: ''
        },
        'AUTH_AGENT_MAIL_CODE': {
          apiField: 'AUTH_AGENT_MAIL_CODE',
          displayField: 'AUTH_AGENT_MAIL_GROUP',
          type: 'string',
          defaultValue: ''
        },
        'AUTH_AGENT_PHONE': {
          apiField: 'AUTH_AGENT_PHONE',
          type: 'string',
          defaultValue: ''
        },
        'AGENCY_CODE': {
          apiField: 'AGENCY_CODE',
          type: 'string',
          defaultValue: ''
        },
        'IS_PROGRAM_ON_HOLD': {
          apiField: 'IS_PROGRAM_ON_HOLD',
          displayField: 'PROGRAM_ON_HOLD',
          type: 'string',
          defaultValue: ''
        },
        'HOLD_BEGIN_DATE': {
          apiField: 'HOLD_BEGIN_DATE',
          type: 'date',
          format: (value: any) => value ? new Date(value).toISOString() : null
        },
        'HOLD_END_DATE': {
          apiField: 'HOLD_END_DATE',
          type: 'date',
          format: (value: any) => value ? new Date(value).toISOString() : null
        },
        'COMMENTS': {
          apiField: 'COMMENTS',
          type: 'string',
          defaultValue: ''
        },
        'ACTIVE': {
          apiField: 'ACTIVE',
          type: 'string',
          defaultValue: 'A'
        },
        'CONTRACT_CAP_CHECK': {
          apiField: 'CONTRACT_CAP_CHECK',
          type: 'string',
          defaultValue: 'N'
        }
      },
      hiddenColumns: [
        'PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY',
        'UPDATE_DATE', 'UPDATE_BY', 'PHASE_TYPE'
      ],
      searchConfig: {
        fields: ['SERVICE_GRP', 'AUTH_AGENT_TYPE', 'IS_PROGRAM_ON_HOLD', 'HOLD_BEGIN_DATE', 'HOLD_END_DATE', 'ACTIVE'],
        defaultValues: {
          ACTIVE: 'A'
        }
      }
    };
  }
  
  private createCAPThresholdConfig(): TableConfig {
    return {
      displayName: 'CAP- CAP_ THRESHOLD',
      apiName: 'SSAS_CAP_THRESHOLD_CEILING',
      prefix: 'MG1_',
      idField: 'ID',
      fields: {
        'ID': {
          apiField: 'ID',
          type: 'number',
          hidden: true,
          format: (value: any) => typeof value === 'string' ? parseInt(value) : value
        },
        'SERVICE_GRP': {
          apiField: 'SERVICE_GRP',
          displayField: 'SERVICE_GROUP',
          type: 'string',
          defaultValue: ''
        },
        'CAP_ID': {
          apiField: 'CAP_ID',
          type: 'string',
          required: true,
          defaultValue: ''
        },
        'CAP_TYPE': {
          apiField: 'CAP_TYPE',
          type: 'string',
          defaultValue: ''
        },
        'LEVEL_OF_SERVICE': {
          apiField: 'LEVEL_OF_SERVICE',
          type: 'string',
          defaultValue: ''
        },
        'SERVICE_CODES': {
          apiField: 'SERVICE_CODES',
          type: 'string',
          defaultValue: ''
        },
        'BEGIN_DATE': {
          apiField: 'BEGIN_DATE',
          type: 'date',
          format: (value: any) => value ? new Date(value).toISOString() : null
        },
        'END_DATE': {
          apiField: 'END_DATE',
          type: 'date',
          format: (value: any) => value ? new Date(value).toISOString() : null
        },
        'LIMIT_TYPE': {
          apiField: 'LIMIT_TYPE',
          type: 'string',
          defaultValue: ''
        },
        'STATE_THRESHOLD': {
          apiField: 'STATE_THRESHOLD',
          type: 'string',
          defaultValue: ''
        },
        'COACH_THRESHOLD': {
          apiField: 'COACH_THRESHOLD',
          type: 'string',
          defaultValue: ''
        },
        'PERCENT_200_THRESHOLD': {
          apiField: 'PERCENT_200_THRESHOLD',
          type: 'string',
          defaultValue: ''
        },
        'LIFE_TIME_CAP_MET': {
          apiField: 'LIFE_TIME_CAP_MET',
          type: 'string',
          defaultValue: ''
        },
        'AGE_LIMIT_TYPE': {
          apiField: 'AGE_LIMIT_TYPE',
          type: 'string',
          defaultValue: ''
        },
        'RANGE_LIMITATION_SERVICE_CODE': {
          apiField: 'RANGE_LIMITATION_SERVICE_CODE',
          type: 'string',
          defaultValue: ''
        },
        'RANGE_LOWER_LIMIT': {
          apiField: 'RANGE_LOWER_LIMIT',
          displayField: 'SERVICE_LOWER_LIMIT',
          type: 'number',
          defaultValue: 0,
          format: (value: any) => typeof value === 'string' ? parseInt(value) : value
        },
        'RANGE_UPPER_LIMIT': {
          apiField: 'RANGE_UPPER_LIMIT',
          displayField: 'SERVICE_UPPER_LIMIT',
          type: 'number',
          defaultValue: 0,
          format: (value: any) => typeof value === 'string' ? parseInt(value) : value
        },
        'ACTIVE': {
          apiField: 'ACTIVE',
          type: 'string',
          defaultValue: 'A'
        },
        'COMMENTS': {
          apiField: 'COMMENTS',
          type: 'string',
          defaultValue: ''
        },
        'TMHP_FLAG': {
          apiField: 'TMHP_FLAG',
          type: 'string',
          defaultValue: ''
        },
        'THRESHOLD_INDICATOR': {
          apiField: 'THRESHOLD_INDICATOR',
          type: 'string',
          defaultValue: ''
        }
      },
      hiddenColumns: [
        'PHASE', 'REC_ID', 'PHASE_TYPE', 'CREATE_DATE', 'CREATE_BY',
        'UPDATE_DATE', 'UPDATE_BY', 'STATUS'
      ],
      searchConfig: {
        fields: ['SERVICE_GRP', 'CAP_ID', 'CAP_TYPE', 'BEGIN_DATE', 'END_DATE', 'ACTIVE'],
        defaultValues: {
          ACTIVE: 'A'
        }
      }
    };
  }
  
  private getDefaultSearchControls(apiTableName: string): SearchControl[] {
    const controls: SearchControl[] = [];
    
    // Add common controls
    controls.push({
      name: 'serviceGroup',
      label: 'Service Group',
      type: 'text',
      defaultValue: ''
    });
    
    controls.push({
      name: 'active',
      label: 'Active',
      type: 'text',
      defaultValue: 'A'
    });
    
    controls.push({
      name: 'history',
      label: 'Include History',
      type: 'checkbox',
      defaultValue: false
    });
    
    // Add table-specific controls
    if (apiTableName === 'SSAS_CAP_THRESHOLD_CEILING') {
      controls.push({
        name: 'capId',
        label: 'CAP ID',
        type: 'text',
        defaultValue: ''
      });
      
      controls.push({
        name: 'capType',
        label: 'CAP Type',
        type: 'text',
        defaultValue: ''
      });
      
      controls.push({
        name: 'serviceCode',
        label: 'Service Code',
        type: 'text',
        defaultValue: ''
      });
      
      controls.push({
        name: 'beginDate',
        label: 'Begin Date',
        type: 'date',
        defaultValue: null
      });
      
      controls.push({
        name: 'endDate',
        label: 'End Date',
        type: 'date',
        defaultValue: null
      });
    } else if (apiTableName === 'SSAS_AUTH_AGENT_AND_HOLD') {
      controls.push({
        name: 'authAgentType',
        label: 'Auth Agent Type',
        type: 'text',
        defaultValue: ''
      });
      
      controls.push({
        name: 'holdBeginDate',
        label: 'Hold Begin Date',
        type: 'date',
        defaultValue: null
      });
      
      controls.push({
        name: 'holdEndDate',
        label: 'Hold End Date',
        type: 'date',
        defaultValue: null
      });
      
      controls.push({
        name: 'programOnHold',
        label: 'Program On Hold',
        type: 'text',
        defaultValue: ''
      });
      
      controls.push({
        name: 'contractCapCheck',
        label: 'Contract Cap Check',
        type: 'text',
        defaultValue: ''
      });
    }
    
    return controls;
  }
  
  private buildSearchControlsFromConfig(config: TableConfig): SearchControl[] {
    const controls: SearchControl[] = [];
    
    // Add common controls
    controls.push({
      name: 'serviceGroup',
      label: 'Service Group',
      type: 'text',
      defaultValue: config.searchConfig?.defaultValues?.['SERVICE_GRP'] || ''
    });
    
    controls.push({
      name: 'active',
      label: 'Active',
      type: 'text',
      defaultValue: config.searchConfig?.defaultValues?.['ACTIVE'] || 'A'
    });
    
    controls.push({
      name: 'history',
      label: 'Include History',
      type: 'checkbox',
      defaultValue: false
    });
    
    // Add table-specific controls
    if (config.searchConfig) {
      config.searchConfig.fields.forEach((fieldName: string) => {
        const fieldConfig = config.fields[fieldName] as TableFieldConfig | undefined;
        if (!fieldConfig) return;
        
        const displayFieldName = fieldConfig.displayField || fieldConfig.apiField;
        const defaultValue = config.searchConfig?.defaultValues?.[fieldName];
        
        // Skip fields we've already added
        if (['SERVICE_GRP', 'ACTIVE'].includes(fieldName)) {
          return;
        }
        
        controls.push({
          name: this.camelCase(displayFieldName),
          label: this.formatFieldLabel(displayFieldName),
          type: this.mapFieldTypeToControlType(fieldConfig.type),
          defaultValue
        });
      });
    }
    
    return controls;
  }
  
  // Format field name as a label
  private formatFieldLabel(fieldName: string): string {
    return fieldName
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Convert to camelCase for form control names
  private camelCase(str: string): string {
    return str.toLowerCase()
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  
  // Map field type to control type
  private mapFieldTypeToControlType(fieldType: string): string {
    switch (fieldType) {
      case 'date': return 'date';
      case 'number': return 'number';
      case 'boolean': return 'checkbox';
      case 'select': return 'select';
      default: return 'text';
    }
  }

  generateSearchControls(config: TableConfig): SearchControl[] {
    return this.getSearchControls(config.apiName);
  }

  createSearchRequestBody(config: TableConfig, formValues: Record<string, any>): any {
    return {
      tableName: config.apiName,
      row: formValues
    };
  }
}