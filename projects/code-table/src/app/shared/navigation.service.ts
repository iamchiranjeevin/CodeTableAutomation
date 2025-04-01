import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { ProductionTable } from '../production-tables/shared/types';
import { ProductionTablesStore } from '../production-tables/production-tables.store';

export interface NavItem {
  name: string;
  route?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private productionTablesStore = inject(ProductionTablesStore);
  private navItemsSubject = new BehaviorSubject<NavItem[]>([]);

  constructor() {
    // Create navigation items from the available production tables
    const availableProductionTables: ProductionTable[] = [
      { id: 1, name: 'AAH-AUTH AGENT HOLD', data: [] },
      { id: 2, name: 'CAP- CAP_ THRESHOLD', data: [] },
      { id: 3, name: 'CF1-BILLING CODE', data: [] },
      { id: 4, name: 'CFB- BILLING COMBINATION', data: [] },
      { id: 5, name: 'CFI-ITEM CODE', data: [] },
      { id: 6, name: 'CFM- ELIGIBILITY COMBINATION', data: [] },
      { id: 7, name: 'CFP-PROCEDURE CODE', data: [] },
      { id: 8, name: 'CFR-PROCEDURE CODE RATE', data: [] },
      { id: 9, name: 'CLC-LVL OF SRVC GRP CROSS REF', data: [] },
      { id: 10, name: 'CLS - LEVEL OF SERVICE', data: [] },
      { id: 11, name: 'CMD - MODIFIER', data: [] },
      { id: 12, name: 'CMR - MODIFIER CROSS REFERENCE', data: [] },
      { id: 13, name: 'CNB-BILL CODE CROSSWALK', data: [] },
      { id: 14, name: 'CNP - NATIONAL PROCEDURE CODES', data: [] },
      { id: 15, name: 'CNS - CMS NATIONAL CODES', data: [] },
      { id: 16, name: 'COV - COVERAGE CODE', data: [] },
      { id: 17, name: 'CPQ - PROCEDURE CODE QUALIFIER', data: [] },
      { id: 18, name: 'CPS - PLACE OF SERVICE', data: [] },
      { id: 19, name: 'CPT - CLIENT PROGRAM TYPE', data: [] },
      { id: 20, name: 'CRC- REVENUE CODES', data: [] },
      { id: 21, name: 'CSG - SERVICE GROUP', data: [] },
      { id: 22, name: 'CSI - SERVICE CODE ITEM REC', data: [] },
      { id: 23, name: 'CSP - SERVICE CODE PROCEDURE', data: [] },
      { id: 24, name: 'CSR - SERVICE CODE', data: [] },
      { id: 25, name: 'CSS - SERVICE GRP SERVICE CD', data: [] },
      { id: 26, name: 'DA2 - SERVICE AUTH EDITS', data: [] },
      { id: 27, name: 'DA3 - NE SERV EDITS', data: [] },
      { id: 28, name: 'DAD - REFERENCE CODES', data: [] },
      { id: 29, name: 'DCE - TMHP DUPLICATE CLAIM EDIT', data: [] },
      { id: 30, name: 'DIA - DIAGNOSIS', data: [] },
      { id: 31, name: 'ECC - ELIGIBILITY CATEGORY', data: [] },
      { id: 32, name: 'FCD - FUND CODE', data: [] },
      { id: 33, name: 'FSR - FISCAL ACCOUNT CODE', data: [] },
      { id: 34, name: 'LBR - SERVICE_RESI_LOCATION', data: [] },
      { id: 35, name: 'LST - LEVEL OF SERVICE TYPE', data: [] },
      { id: 36, name: 'MSQ - MOVEMENT_SEQUENCES', data: [] },
      { id: 37, name: 'PME - TMHP MUTEX', data: [] },
      { id: 38, name: 'REF - REFERENCE_TABLE', data: [] },
      { id: 39, name: 'SGO - SRVC GRP SRVC OVERLAP', data: [] }
    ];
    
    const navItems: NavItem[] = [
      {
        name: 'Production Tables',
        expanded: true,
        children: availableProductionTables.map((table: ProductionTable) => ({
          name: table.name,
          route: `/production-tables/${encodeURIComponent(table.name)}`
        }))
      }
    ];
    
    this.navItemsSubject.next(navItems);
  }

  getNavItems() {
    return this.navItemsSubject.asObservable();
  }

  toggleExpanded(item: NavItem) {
    item.expanded = !item.expanded;
    this.navItemsSubject.next([...this.navItemsSubject.value]);
  }
} 