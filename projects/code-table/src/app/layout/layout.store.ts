import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { MenuLink } from './shared/types';

interface InitialState {
  activeLink: Partial<MenuLink>;
  activeUrl: string;
  activeIds: string[];
  _showSideNav: boolean;
}

export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState<InitialState>({
    activeLink: {},
    activeUrl: '',
    activeIds: [],
    _showSideNav: false,
  }),
  withComputed(store => ({
    showSideNav: store._showSideNav,
  })),
  withMethods(store => ({
    resetState() {
      patchState(store, { activeLink: {}, activeUrl: '' });
    },
    updateActiveLink({
      activeLink,
      activeUrl,
      activeIds,
    }: {
      activeLink: Partial<MenuLink>;
      activeUrl: string;
      activeIds: string[];
    }) {
      patchState(store, { activeLink, activeUrl, activeIds });
    },
    showSideNav: () => {
      patchState(store, { _showSideNav: !store._showSideNav() });
    },
    sideNavToggle: () => {
      return store._showSideNav;
    },
  }))
);
