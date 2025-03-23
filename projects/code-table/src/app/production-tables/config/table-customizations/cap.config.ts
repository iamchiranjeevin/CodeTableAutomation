import { TableConfig } from '../table-config.types';

export const CAP_CONFIG: TableConfig = {
  apiName: 'SSAS_CAP_THRESHOLD_CEILING',
  displayName: 'CAP - CAP THRESHOLD',
  searchConfig: {
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
      }
    ]
  },
  columnMappings: [
    {
      apiName: 'SERVICE_GRP',
      displayName: 'SERVICE_GROUP',
      dataType: 'string',
      editable: true
    },
    {
      apiName: 'CAP_ID',
      displayName: 'CAP_ID',
      dataType: 'string',
      editable: true
    },
    {
      apiName: 'CAP_TYPE',
      displayName: 'CAP_TYPE',
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
    },
    {
      apiName: 'LIMIT_TYPE',
      displayName: 'LIMIT_TYPE',
      dataType: 'number',
      editable: true
    },
    {
      apiName: 'STATE_THRESHOLD',
      displayName: 'STATE_THRESHOLD',
      dataType: 'number',
      editable: true
    },
    {
      apiName: 'COACH_THRESHOLD',
      displayName: 'COACH_THRESHOLD',
      dataType: 'number',
      editable: true
    },
    {
      apiName: 'PERCENT_200_THRESHOLD',
      displayName: 'PERCENT_200_THRESHOLD',
      dataType: 'number',
      editable: true
    },
    {
      apiName: 'SERVICE_LOWER_LIMIT',
      displayName: 'RANGE_LOWER_LIMIT',
      dataType: 'number',
      editable: true
    },
    {
      apiName: 'SERVICE_UPPER_LIMIT',
      displayName: 'RANGE_UPPER_LIMIT',
      dataType: 'number',
      editable: true
    },
    {
      apiName: 'ACTIVE',
      displayName: 'ACTIVE',
      dataType: 'string',
      editable: true
    }
  ],
  hiddenColumns: [
    'PHASE', 'REC_ID', 'PHASE_TYPE', 'CREATE_DATE', 'CREATE_BY',
    'UPDATE_DATE', 'UPDATE_BY', 'STATUS'
  ],
  detailsConfig: {
    tabs: ['General', 'Thresholds', 'Limits'],
    fieldGroups: {
      'General': [
        'SERVICE_GROUP', 'CAP_ID', 'CAP_TYPE', 'BEGIN_DATE', 'END_DATE', 'ACTIVE'
      ],
      'Thresholds': [
        'STATE_THRESHOLD', 'COACH_THRESHOLD', 'PERCENT_200_THRESHOLD'
      ],
      'Limits': [
        'LIMIT_TYPE', 'RANGE_LOWER_LIMIT', 'RANGE_UPPER_LIMIT'
      ]
    }
  }
}; 