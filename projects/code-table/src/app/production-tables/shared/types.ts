export type ProductionTable = {
  name: string;
  id: number;
  data: ProductionTableData[];
  totalRowCount?: number | null;
};
 
export type ProductionTableData = {
  [key: string]: string | number | boolean | null;
};
 
export type ProductionTableRow = {
  id:number;
  serviceGroup: string;
  authAgentType: string;
  authAgentName: string;
  authAgentId: string;
  authAgentMailCode: string;
  authAgentPhone: string;
  agencyCode: string;
  isProgramOnHold: string;
  holdBeginDate: string | null;
  holdEndDate: string | null;
  active: string;
  contractCapCheck:string;
  comments: string;
  recid: string;
};
 
export type BaseUpdateRequestBody = {
  tableName: string;
  id: string;
  from: string;
  to: string;
  userName: string;
};
 
export interface DynamicTableRow {
  [key: string]: string | number | null;
}
 
export type DynamicUpdateRequestBody = BaseUpdateRequestBody & {
  row: DynamicTableRow;
};
 
export type AAHUpdateRequestBody = BaseUpdateRequestBody & {
  row: {
    ID: number;
    SERVICE_GRP: string;
    AUTH_AGENT_TYPE: string;
    AUTH_AGENT_NAME: string;
    AUTH_AGENT_ID: string;
    AUTH_AGENT_MAIL_CODE: string;
    AUTH_AGENT_PHONE: string;
    AGENCY_CODE: string;
    IS_PROGRAM_ON_HOLD: string;
    HOLD_BEGIN_DATE: string | null;
    HOLD_END_DATE: string | null;
    CONTRACT_CAP_CHECK: string;
    COMMENTS: string;
    ACTIVE: string;
  };
};
 
export type CapUpdateRequestBody = BaseUpdateRequestBody & {
  row: {
    ID: number;
    PHASE_TYPE: string;
    ROW_NO: string;
    PHASE: string;
    SERVICE_GROUP: string;
    CAP_ID: string;
    CAP_TYPE: string;
    LEVEL_OF_SERVICE: string;
    SERVICE_CODES: string;
    BEGIN_DATE: string | null;
    END_DATE: string | null;
    LIMIT_TYPE: number;
    STATE_THRESHOLD: number;
    COACH_THRESHOLD: number;
    PERCENT_200_THRESHOLD: number;
    LIFE_TIME_CAP_MET: string;
    AGE_LIMIT_TYPE: number;
    RANGE_LIMITATION_SERVICE_CODE: string;
    SERVICE_LOWER_LIMIT: number;
    SERVICE_UPPER_LIMIT: number;
    ACTIVE: string;
    COMMENTS: string;
    TMHP_FLAG: string;
    THRESHOLD_INDICATOR: string;
  };
};
  export type CF1UpdateRequestBody = BaseUpdateRequestBody & {
    row: {
   ID : number
  ITEM_CD : string;
  DESCRIPTION :string;
  ACTIVE : string;
  BEGIN_DATE :string | null;  
  END_DATE :string | null;  
  PHASE_TYPE  : string;
  COMMENTS  : string;
  SORT_ORDER  : string;
  TMHP_FLAG : string;
    };
};
 
export type CFBUpdateRequestBody = BaseUpdateRequestBody & {
  row: {
    ID: number
    BILLING_CODE: string;
    SERVICE_GRP: string,
    LEVEL_OF_SERVICE_TYPE: string;
    LEVEL_OF_SERVICE: string;
    SERVICE_CODE: string;
    ACTIVE: string;
    BEGIN_DATE: string | null;
    END_DATE: string | null;
    FUND_CD: string;
    FED_TYPE_OF_SERVICE:string;
    MI_RECORD_TYPE:string;
    COMMENTS: string
  
  };
};
 
export type CFIUpdateRequestBody = BaseUpdateRequestBody & {
  row: {
    ID: number;
    ITEM_CODE: string;
    DESCRIPTION: string;
    ACTIVE: string;
    BEGIN_DATE: string | null;
    END_DATE: string | null;
    COMMENTS: string | null;
  };
};
 
export type CFMUpdateRequestBody = BaseUpdateRequestBody & {
  row: {
    ID: number;
    ELIGIBILITY_CATEGORY: string;
    SERVICE_GRP: string;
    ACTIVE: string;
    BEGIN_DATE: string | null;
    END_DATE: string | null;
    COMMENTS: string | null;
  };
};
 
export type CFPUpdateRequestBody = BaseUpdateRequestBody & {
  row: {
    ID: number;
    PROCEDURE_CODE: string;
    DESCRIPTION: string;
    PROCEDURE_TYPE: string;
    ACTIVE: string;
    BEGIN_DATE: string | null;
    END_DATE: string | null;
    COMMENTS: string | null;
    TMHP_FLAG: string;
  };
};
 
export type UpdateRequestBody = AAHUpdateRequestBody | CapUpdateRequestBody |
  CF1UpdateRequestBody | CFBUpdateRequestBody | CFIUpdateRequestBody |
  CFMUpdateRequestBody | CFPUpdateRequestBody;
 
  export interface ProductionTablePaginationResponse {
    success:       boolean;
    totalRowCount: number;
    rowCount:      number;
    pagination:    boolean;
    message:       null;
    rows:          Row[];
}

export interface Row {
    ROW_NO:                number;
    PHASE:                 string;
    REC_ID:                string;
    ID:                    number;
    BILLING_CODE:          string;
    SERVICE_GRP:           string;
    LEVEL_OF_SERVICE_TYPE: null;
    LEVEL_OF_SERVICE:      null;
    SERVICE_CODE:          string;
    ACTIVE:                string;
    BEGIN_DATE:            Date;
    END_DATE:              Date;
    CREATE_DATE:           Date;
    CREATE_BY:             string;
    UPDATE_DATE:           Date;
    UPDATE_BY:             string;
    PHASE_TYPE:            number;
    FUND_CD:               string;
    FED_TYPE_OF_SERVICE:   string;
    MI_RECORD_TYPE:        string;
    COMMENTS:              null;
}
