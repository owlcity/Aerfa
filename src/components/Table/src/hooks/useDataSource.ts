import { ref, ComputedRef, unref, computed, onMounted, watchEffect, watch } from 'vue';
import type { BasicTableProps } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import { isBoolean } from '@/utils/is';
import { APISETTING, DEFAULTPAGESIZE } from '../const';

export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { getPaginationInfo, setPagination, setLoading, tableData },
  emit
) {
  const dataSourceRef = ref<Recordable[]>([]);

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource, request }: any = unref(propsRef);
      !request && dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    }
  );

  const getRowKey = computed(() => {
    const { rowKey }: any = unref(propsRef);
    return rowKey
      ? rowKey
      : () => {
          return 'key';
        };
  });
  
  const getRowClassName = computed(() => {
    const { rowClassName }: any = unref(propsRef);
    return rowClassName
  });


  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  async function fetch(opt?: {}, isRestReload?) {
    try {
      setLoading(true);
      const { request, pagination }: any = unref(propsRef);
      if (!request) return;
      //组装分页信息
      const pageField = APISETTING.pageField;
      const sizeField = APISETTING.sizeField;
      const totalField = APISETTING.totalField;
      const listField = APISETTING.listField;
      const itemCount = APISETTING.countField;
      let pageParams = {};
      const { page = 1, pageSize = DEFAULTPAGESIZE } = unref(getPaginationInfo) as PaginationProps;
      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt[pageField]) || page;
        pageParams[sizeField] = pageSize;
      }

      const params = {
        ...pageParams,
        ...opt,
      };

      //如果是重置刷新，重置页码
      if (isRestReload) {
        params[pageField] = 1;
        setPagination({
          page: 1,
        });
      }
      const res = await request(params);
      const resultTotal = res[totalField] || 0;
      const currentPage = res[pageField];
      const total = res[itemCount] || 0;
      const results = res[listField] ? res[listField] : [];

      // 如果数据异常，需获取正确的页码再次执行
      if (resultTotal) {
        if (page > resultTotal) {
          const currentTotalPage = Math.ceil(resultTotal / pageSize);
          setPagination({
            page: currentTotalPage,
            [itemCount]: total,
          });
          return await fetch(opt);
        }
      }

      dataSourceRef.value = results;
      setPagination({
        [pageField]: currentPage,
        [totalField]: resultTotal,
        [itemCount]: total,
      });
      if (opt && opt[pageField]) {
        setPagination({
          [pageField]: opt[pageField] || 1,
        });
      }
      emit('fetch-success', {
        items: unref(results),
        resultTotal,
      });
    } catch (error) {
      console.error(error);
      const totalField = APISETTING.totalField;
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        [totalField]: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fetch();
    }, 16);
  });

  function setTableData<T = Recordable>(values: T[]) {
    dataSourceRef.value = values;
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[];
  }

  async function reload(opt?) {
    await fetch(opt);
  }

  async function restReload(opt?) {
    await fetch(opt, true);
  }

  async function updateTableData(index: number, key: string, value: any) {
    const record = dataSourceRef.value[index];
    if (record) {
      dataSourceRef.value[index][key] = value;
    }
    return dataSourceRef.value[index];
  }

  function updateTableDataRecord(index: number, record: Recordable): Recordable | undefined {
    if (!dataSourceRef.value || dataSourceRef.value.length === 0) return;
    const row = dataSourceRef.value[index] || [];
    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) row[field] = record[field];
      }
      return row;
    }
  }

  function deleteTableDataRecord(index: number) {
    if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
    if (index >= 0) {
      dataSourceRef.value.splice(index, 1);
    }
  }

  return {
    fetch,
    getRowKey,
    getRowClassName,
    getDataSourceRef,
    getDataSource,
    setTableData,
    reload,
    restReload,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
  };
}
