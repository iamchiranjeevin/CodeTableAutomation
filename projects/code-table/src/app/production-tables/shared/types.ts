export type ProductionTable = {
  name: string;
  id: number;
  data: ProductionTableData[];
};

export type ProductionTableData = {
  [key: string]: string | number | boolean | null;
};
