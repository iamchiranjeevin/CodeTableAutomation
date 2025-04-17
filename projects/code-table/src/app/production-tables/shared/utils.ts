import { ProductionTable } from './types';

export function propsToSet(rows: [], keys: Set<string>) { 
  rows.forEach((row) => {   
    Object.keys(row).forEach(key => keys.add(key));
  });
}


const TABLE_NAME_MAPPING: Record<string, string> = {
  'SSAS_AUTH_AGENT_AND_HOLD': 'AAH-AUTH AGENT HOLD',
  'SSAS_CAP_THRESHOLD_CEILING': 'CAP- CAP_ THRESHOLD',
  'CF1': 'CF1-BILLING CODE',
  'CFB': 'CFB- BILLING COMBINATION',
  'CFI': 'CFI-ITEM CODE',
  'CFM': 'CFM- ELIGIBILITY COMBINATION',
  'CFP': 'CFP-PROCEDURE CODE',
  'CFR': 'CFR-PROCEDURE CODE RATE',
  'CLC': 'CLC-LVL OF SRVC GRP CROSS REF',
  'CLS': 'CLS - LEVEL OF SERVICE',
  'CMD': 'CMD - MODIFIER',
  'CMR': 'CMR - MODIFIER CROSS REFERENCE',
  'CNB': 'CNB-BILL CODE CROSSWALK',
  'CNP': 'CNP - NATIONAL PROCEDURE CODES',
  'CNC': 'CNS - CMS NATIONAL CODES',
  'COV': 'COV - COVERAGE CODE',
  'CPQ': 'CPQ - PROCEDURE CODE QUALIFIER',
  'CPS': 'CPS - PLACE OF SERVICE',
  'CPT': 'CPT - CLIENT PROGRAM TYPE',
  'CRC': 'CRC- REVENUE CODES',
  'CSG': 'CSG - SERVICE GROUP',
  'CSI': 'CSI - SERVICE CODE ITEM REC',
  'CSP': 'CSP - SERVICE CODE PROCEDURE',
  'CSR': 'CSR - SERVICE CODE',
  'CSS': 'CSS - SERVICE GRP SERVICE CD',
  'DA2': 'DA2 - SERVICE AUTH EDITS',
  'DA3': 'DA3 - NE SERV EDITS',
  'DAD': 'DAD - REFERENCE CODES',
  'DCE': 'DCE - TMHP DUPLICATE CLAIM EDIT',
  'SSAS_DIAGNOSIS': 'DIA - DIAGNOSIS',
  'ECC': 'ECC - ELIGIBILITY CATEGORY',
  'FCD': 'FCD - FUND CODE',
  'FSR': 'FSR - FISCAL ACCOUNT CODE',
  'SSAS_SERVICE_RESI_LOCATION': 'LBR - SERVICE_RESI_LOCATION',
  'LST': 'LST - LEVEL OF SERVICE TYPE',
  'SSAS_MOVEMENT_SEQUENCES': 'MSQ - MOVEMENT_SEQUENCES',
  'PME': 'PME - TMHP MUTEX',
  'SSAS_REFERENCE_TABLE': 'REF - REFERENCE_TABLE',
  'SGO': 'SGO - SRVC GRP SRVC OVERLAP'
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
