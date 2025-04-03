import { ProductionTable } from './types';

export function propsToSet(rows: [], keys: Set<string>) { 
  rows.forEach((row) => {   
    Object.keys(row).forEach(key => keys.add(key));
  });
}


const TABLE_NAME_MAPPING: Record<string, string> = {
  'SSAS_AUTH_AGENT_AND_HOLD': 'AAH-AUTH AGENT HOLD',
  'SSAS_CAP_THRESHOLD_CEILING': 'CAP- CAP_ THRESHOLD' 
};

const REVERSE_TABLE_NAME_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(TABLE_NAME_MAPPING).map(([key, value]) => [value, key])
);


export function getDisplayTableName(apiTableName: string): string {
  return TABLE_NAME_MAPPING[apiTableName] || apiTableName;
};

export function getApiTableName(displayTableName: string): string {
  return REVERSE_TABLE_NAME_MAPPING[displayTableName] || displayTableName;
};

export function trimTablePrefix(tableName: string): string {
  return tableName.replace(/^MG1_/, '');
}

export function trimTableSuffix(tableName: string): string {
  return tableName.replace(/ PRODUCTION VIEW$/, '');
}

