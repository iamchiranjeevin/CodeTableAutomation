export type ProductionTable = {
  name: string;
  id: number;
  data: ProductionTableData[];
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

export type UpdateRequestBody = AAHUpdateRequestBody | CapUpdateRequestBody;

