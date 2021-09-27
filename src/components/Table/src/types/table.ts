import type { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface';
import { ComponentType } from './componentType';
export interface BasicColumn<T> extends TableBaseColumn<T> {
  //编辑表格
  edit?: boolean;
  editRow?: boolean;
  editable?: boolean;
  editComponent?: ComponentType;
  editComponentProps?: Recordable;
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  editValueMap?: (value: any) => string;
  onEditRow?: () => void;
  // 权限编码控制是否显示
  auth?: string[];
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn<T>) => boolean);
}

export interface TableActionType<T> {
  reload: (opt) => Promise<void>;
  emit?: any;
  getColumns: (opt?) => BasicColumn<T>[];
  setColumns: (columns: BasicColumn<T>[] | string[]) => void;
}

export interface BasicTableProps {
  title?: string;
  dataSource: Function;
  columns: any[];
  pagination: object;
  showPagination: boolean;
  actionColumn: any[];
  canResize: boolean;
  resizeHeightOffset: number;
  loading?: boolean;
}
