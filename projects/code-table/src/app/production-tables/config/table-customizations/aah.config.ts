import { TableConfig } from '../table-config.types';

export const AAH_CONFIG: TableConfig = {
  apiName: 'SSAS_AUTH_AGENT_AND_HOLD',
  displayName: 'AAH-AUTH AGENT HOLD',
  searchConfig: {
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
  },
  columnMappings: [
    {
      apiName: 'AUTH_AGENT_ID',
      displayName: 'AUTH_AGENT_ID',
      dataType: 'string',
      editable: true
    },
    {
      apiName: 'AUTH_AGENT_NAME',
      displayName: 'AUTH_AGENT_NAME',
      dataType: 'string',
      editable: true
    },
    {
      apiName: 'IS_PROGRAM_ON_HOLD',
      displayName: 'PROGRAM_ON_HOLD',
      dataType: 'string',
      editable: true
    },
    {
      apiName: 'BEGIN_DATE',
      displayName: 'BEGIN_DATE',
      dataType: 'date',
      editable: true,
      formatter: (value) => value ? new Date(value).toLocaleDateString() : null
    },
    {
      apiName: 'END_DATE',
      displayName: 'END_DATE',
      dataType: 'date',
      editable: true,
      formatter: (value) => value ? new Date(value).toLocaleDateString() : null
    }
  ],
  hiddenColumns: [
    'PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY',
    'UPDATE_DATE', 'UPDATE_BY', 'PHASE_TYPE'
  ],
  detailsConfig: {
    tabs: ['General', 'Program Details'],
    fieldGroups: {
      'General': [
        'AUTH_AGENT_ID', 'AUTH_AGENT_NAME', 'BEGIN_DATE', 'END_DATE'
      ],
      'Program Details': [
        'PROGRAM_ON_HOLD'
      ]
    }
  }
}; 