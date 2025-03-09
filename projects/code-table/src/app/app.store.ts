import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { APP_ROUTES } from './shared/constants';
import { MenuLink } from './layout/shared/types';
import { LayoutStore } from './layout/layout.store';
import { Project, ProjectType, TestPhaseStatus } from './projects/shared/types';
import { v4 as uuid } from 'uuid';
import { PROJECTS_ROUTES } from './projects/shared/constants';
import { TEST_PHASES_ROUTES } from './projects/test-phases/shared/constants';
import { ProductionTable } from './production-tables/shared/types';

const data = <T extends { [i: string]: any }>(links: T, parentPath = '') => {
  const keys = Object.keys(links);
  const obj: MenuLink[] = [];
  keys.forEach(key => {
    const route = structuredClone(links[key]);
    route.path =
      route.parent.length === 0
        ? `/${route.path}`
        : `${parentPath}/${route.path}`;
    if (route?.children) {
      route.children = structuredClone(
        data(structuredClone(route.children), route.path)
      );
    }
    obj.push({
      path: route.path,
      children: route.children,
      title: route.title,
      id: route.id,
    });
  });
  return obj;
};
const getDetails = (
  data: MenuLink[],
  targetUrl: string
): MenuLink | undefined => {
  return data.find(({ children, path }) => {
    if (children) {
      return getDetails(children, targetUrl);
    }
    return path === targetUrl ? path : undefined;
  });
};

const initialState = {
  projects: APP_ROUTES.projects,
  productionTables: APP_ROUTES.productionTables,
  admin: APP_ROUTES.admin,
  rugs: APP_ROUTES.rugs,
};

const menuLinks: MenuLink[] = [];

const getProjectsTestPhaseLink = (
  projects: string,
  testPhases: string,
  id: number,
  testPhaseStatus: TestPhaseStatus
) => {
  const {
    beforeTest: { path: beforeTestPath },
    test: { path: testPath },
    tested: { path: testedPath },
  } = TEST_PHASES_ROUTES;
  if (testPhaseStatus === 'tmhp_test') {
    return `/${projects}/${testPhases}/${testPath}/${id}`;
  }
  if (testPhaseStatus === 'tested') {
    return `/${projects}/${testPhases}/${testedPath}/${id}`;
  }
  if (testPhaseStatus === 'before_tmhp') {
    return `/${projects}/${testPhases}/${beforeTestPath}/${id}`;
  }
  return '';
};

function getProjectLink(
  id: number,
  type: ProjectType,
  testPhaseStatus: TestPhaseStatus
) {
  const { testPhases, workInProgress, archived, deleted } = PROJECTS_ROUTES;
  const { projects } = APP_ROUTES;
  switch (type) {
    case 'Testphases':
      return getProjectsTestPhaseLink(
        projects.path,
        testPhases.path,
        id,
        testPhaseStatus
      );
    case 'archived':
      return `/${projects.path}/${archived.path}/${id}`;
    case 'deleted':
      return `/${projects.path}/${deleted.path}/${id}`;
    case 'workinprogress':
      return `/${projects.path}/${workInProgress.path}/${id}`;
  }
}

function convertProjectToMenuLink(project: Project) {
  const menuLink: MenuLink = {
    title: project.name,
    path: getProjectLink(project.id, project.type, project.test_phase_status),
    id: uuid(),
  };
  return menuLink;
}

const updateTestPhaseChildren = (
  child: MenuLink,
  testedPath: string,
  testedLinks: MenuLink[],
  beforeThmpPath: string,
  beforeThmpLinks: MenuLink[],
  thmpTestedPath: string,
  thmpTestedLinks: MenuLink[]
) => {
  if (child.path.includes(testedPath)) {
    child.children = testedLinks;
  }
  if (child.path.includes(beforeThmpPath)) {
    child.children = beforeThmpLinks;
  }
  if (child.path.includes(thmpTestedPath)) {
    child.children = thmpTestedLinks;
  }
};

const updateProjectNestedPaths = (
  childLink: MenuLink,
  workInProgressPath: string,
  workInProgressProjects: MenuLink[],
  archivedPath: string,
  archivedLinks: MenuLink[],
  deletedPath: string,
  deletedProjectsLinks: MenuLink[],
  testPhasesPath: string,
  testedPath: string,
  testedLinks: MenuLink[],
  beforeThmpPath: string,
  beforeThmpLinks: MenuLink[],
  thmpTestedPath: string,
  thmpTestedLinks: MenuLink[]
) => {
  if (childLink.path.includes(workInProgressPath)) {
    childLink.children = workInProgressProjects;
  }
  if (childLink.path.includes(archivedPath)) {
    childLink.children = archivedLinks;
  }
  if (childLink.path.includes(deletedPath)) {
    childLink.children = deletedProjectsLinks;
  }
  if (childLink.path.includes(testPhasesPath)) {
    childLink.children?.forEach(child => {
      updateTestPhaseChildren(
        child,
        testedPath,
        testedLinks,
        beforeThmpPath,
        beforeThmpLinks,
        thmpTestedPath,
        thmpTestedLinks
      );
    });
  }
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState({
    _appLinks: initialState,
    _menuLinks: menuLinks,
  }),
  withHooks({
    onInit: (
      store,
      router = inject(Router),
      destroyRef = inject(DestroyRef),
      layoutStore = inject(LayoutStore)
    ) => {
      patchState(store, { _menuLinks: data(store._appLinks()) });
      router.events.pipe(takeUntilDestroyed(destroyRef)).subscribe(event => {
        const extracted = (
          urlSegments: string[],
          currentMatchingUrl: string,
          activeIds: string[],
          links: MenuLink[]
        ) => {
          urlSegments.forEach((urlSegment, index) => {
            const segment =
              currentMatchingUrl !== ''
                ? `${currentMatchingUrl}/${urlSegment}`
                : `/${urlSegment}`;

            const matchingLink = links.find(link => link.path === segment);
            if (matchingLink) {
              activeIds.push(matchingLink.id);
              extracted(
                urlSegments.splice(index),
                segment,
                activeIds,
                matchingLink.children ?? []
              );
            }
          });
        };

        if (event instanceof NavigationEnd) {
          const { urlAfterRedirects: activeUrl } = event;
          const activeLink = getDetails(store._menuLinks(), activeUrl);
          if (activeLink) {
            const urlSegments = activeUrl
              .split('/')
              .filter(segment => segment !== '');
            const activeIds: string[] = [];
            const links = store._menuLinks();
            extracted(urlSegments, '', activeIds, links);
            layoutStore.updateActiveLink({ activeLink, activeUrl, activeIds });
          }
        }
      });
    },
  }),
  withComputed(store => ({
    menuLinks: computed(() => store._menuLinks),
  })),
  withMethods(store => ({
    updateProductionTables: (productionTables: ProductionTable[]) => {
      const { productionTables: routeType } = APP_ROUTES;
      const productionTableChildren: MenuLink[] = productionTables.map(
        table => {
          const menuLink: MenuLink = {
            title: table.name,
            path: `${routeType.path}/${table.id}`,
            id: uuid(),
          };
          return menuLink;
        }
      );
      const links = structuredClone(store._menuLinks());
      links.forEach(link => {
        if (link.path.includes(routeType.path)) {
          link.children = productionTableChildren;
        }
      });
      patchState(store, { _menuLinks: links });
    },
    updateProjects: (projects: Project[]) => {
      const getMenuLinks = (projectType: ProjectType) => {
        return projects
          .filter(project => project.type === projectType)
          .map(project => convertProjectToMenuLink(project));
      };

      const generateTestPhaseLinks = (
        projects: Project[],
        testPhaseStatus: TestPhaseStatus
      ) => {
        return projects
          .filter(
            project =>
              project.type === 'Testphases' &&
              project.test_phase_status === testPhaseStatus
          )
          .map(project => convertProjectToMenuLink(project));
      };

      const workInProgressProjects = getMenuLinks('workinprogress');
      const archivedLinks = getMenuLinks('archived');
      const deletedProjectsLinks = getMenuLinks('deleted');
      const thmpTestedLinks = generateTestPhaseLinks(projects, 'tmhp_test');
      const testedLinks = generateTestPhaseLinks(projects, 'tested');
      const beforeThmpLinks = generateTestPhaseLinks(projects, 'before_tmhp');
      const projectsPath = APP_ROUTES.projects.title;
      const { testPhases, workInProgress, archived, deleted } = PROJECTS_ROUTES;
      const { test, beforeTest, tested } = TEST_PHASES_ROUTES;
      const thmpTestedPath = test.path;
      const testedPath = tested.path;
      const beforeThmpPath = beforeTest.path;
      const workInProgressPath = workInProgress.path;
      const archivedPath = archived.path;
      const testPhasesPath = testPhases.path;
      const deletedPath = deleted.path;

      const newMenuItems = structuredClone(store._menuLinks()).map(
        (menuLink: MenuLink) => {
          if (menuLink.title === projectsPath) {
            menuLink.children?.forEach((childLink: MenuLink) => {
              updateProjectNestedPaths(
                childLink,
                workInProgressPath,
                workInProgressProjects,
                archivedPath,
                archivedLinks,
                deletedPath,
                deletedProjectsLinks,
                testPhasesPath,
                testedPath,
                testedLinks,
                beforeThmpPath,
                beforeThmpLinks,
                thmpTestedPath,
                thmpTestedLinks
              );
            });
          }
          return menuLink;
        }
      );
      patchState(store, { _menuLinks: newMenuItems });
    },
  }))
);
