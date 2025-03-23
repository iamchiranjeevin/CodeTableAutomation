import { TableConfig } from './table-config.types';
import { AAH_CONFIG } from './table-customizations/aah.config';
import { CAP_CONFIG } from './table-customizations/cap.config';

// Registry of all table configurations
export const TABLE_REGISTRY: Record<string, TableConfig> = {
  'SSAS_AUTH_AGENT_AND_HOLD': AAH_CONFIG,
  'SSAS_CAP_THRESHOLD_CEILING': CAP_CONFIG,
  // Add more tables here as they are implemented
};

// Mapping from display names to API names
export const DISPLAY_TO_API_MAPPING: Record<string, string> = Object.entries(TABLE_REGISTRY).reduce(
  (acc, [apiName, config]) => {
    acc[config.displayName] = apiName;
    return acc;
  }, 
  {} as Record<string, string>
);

// Mapping from API names to display names
export const API_TO_DISPLAY_MAPPING: Record<string, string> = Object.entries(TABLE_REGISTRY).reduce(
  (acc, [apiName, config]) => {
    acc[apiName] = config.displayName;
    return acc;
  }, 
  {} as Record<string, string>
); 