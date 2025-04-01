import { AppRoute, AppRoutesKeys } from '../../shared/types';
import { RugsRoutesKeys } from './types';
import { v4 as uuidv4 } from 'uuid';

export const RUGS_ROUTES: AppRoute<
  RugsRoutesKeys,
  Extract<AppRoutesKeys, 'rugs'>,
  undefined
> = {
  blockedContracts: {
    title: 'Blocked Contracts',
    path: 'blocked-contracts',
    parent: 'rugs',
    id: uuidv4(),
  },
  rugErrorCodes: {
    title: 'RUGS Error Codes',
    path: 'rug-error-code',
    parent: 'rugs',
    id: uuidv4(),
  },
};

export const RugsRoutes = ['rugErrorCodes', 'blockedContracts'] as const;
