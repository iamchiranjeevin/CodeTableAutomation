export type MenuLink = {
  title: string;
  children?: MenuLink[];
  path: string;
  id: string;
};
