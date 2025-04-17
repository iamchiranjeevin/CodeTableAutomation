import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedContractsComponent } from './blocked-contracts.component';

describe('BlockedContractsComponent', () => {
  let component: BlockedContractsComponent;
  let fixture: ComponentFixture<BlockedContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockedContractsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
