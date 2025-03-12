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
  holdBeginDate: string;
  holdEndDate: string;
  active: string;
  contractCapCheck:string;
  comments: string;
  recid: string;
};

export type UpdateRequestBody = {
  tableName: string;
  id: string;
  from: string;
  to: string;
  userName: string;
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

