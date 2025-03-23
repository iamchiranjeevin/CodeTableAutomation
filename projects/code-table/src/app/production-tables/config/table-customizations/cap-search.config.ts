import { TableSearchConfig } from '../search-config.types';

export const CAP_SEARCH_CONFIG: TableSearchConfig = {
  enabled: true,
  fields: [
    {
      type: 'select',
      label: 'Service Group',
      field: 'serviceGroup',
      options: ['21', '22', '23']
    },
    {
      type: 'select',
      label: 'CAP ID',
      field: 'capId'
    },
    {
      type: 'select',
      label: 'CAP Type',
      field: 'capType'
    },
    {
      type: 'date',
      label: 'Begin Date',
      field: 'beginDate'
    },
    {
      type: 'date',
      label: 'End Date',
      field: 'endDate'
    },
    {
      type: 'select',
      label: 'Active',
      field: 'active',
      options: ['A', 'C']
    },
    {
      type: 'checkbox',
      label: 'History',
      field: 'history',
      defaultValue: false
    },
    {
      type: 'text',
      label: 'THRESHOLD CEILING',
      field: 'thresholdCeiling'
    },
    {
      type: 'text',
      label: 'THRESHOLD FLOOR',
      field: 'thresholdFloor'
    },
    {
      type: 'date',
      label: 'EFFECTIVE DATE',
      field: 'effectiveDate'
    },
    {
      type: 'date',
      label: 'END DATE',
      field: 'endDate'
    }
  ]
}; 