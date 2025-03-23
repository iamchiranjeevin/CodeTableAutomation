import { TableSearchConfig } from '../search-config.types';

export const AAH_SEARCH_CONFIG: TableSearchConfig = {
  enabled: true,
  fields: [
    {
      type: 'select',
      label: 'Service Group',
      field: 'serviceGroup'
    },
    {
      type: 'date',
      label: 'Hold Begin Date',
      field: 'holdBeginDate'
    },
    {
      type: 'date',
      label: 'Hold End Date',
      field: 'holdEndDate'
    },
    {
      type: 'select',
      label: 'Active',
      field: 'active',
      options: ['A', 'C']
    },
    {
      type: 'select',
      label: 'Program On Hold',
      field: 'programOnHold',
      options: ['Y', 'N']
    },
    {
      type: 'checkbox',
      label: 'History',
      field: 'history',
      defaultValue: false
    },
    {
      type: 'checkbox',
      label: 'Contract Cap Check',
      field: 'contractCapCheck',
      defaultValue: false
    }
  ]
}; 