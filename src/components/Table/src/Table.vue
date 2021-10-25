<template>
  <div class="table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center table-toolbar-left">
      <template v-if="title">
        <div class="table-toolbar-left-title">
          {{ title }}
          <n-tooltip v-if="titleTooltip" trigger="hover">
            <template #trigger>
              <n-icon class="ml-1 text-gray-400 cursor-pointer" size="18">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            {{ titleTooltip }}
          </n-tooltip>
        </div>
      </template>
      <slot name="tableTitle"></slot>
    </div>

    <div class="flex items-center table-toolbar-right">
      <!--顶部右侧区域-->
      <slot name="toolbar"></slot>

      <!--刷新-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon" @click="reload">
            <n-icon size="18">
              <ReloadOutlined />
            </n-icon>
          </div>
        </template>
        <span>刷新</span>
      </n-tooltip>

      <!--密度-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon">
            <n-dropdown
              v-model:value="tableSize"
              :options="densityOptions"
              trigger="click"
              @select="densitySelect"
            >
              <n-icon size="18">
                <ColumnHeightOutlined />
              </n-icon>
            </n-dropdown>
          </div>
        </template>
        <span>密度</span>
      </n-tooltip>

      <!--表格设置单独抽离成组件-->
      <ColumnSetting />
    </div>
  </div>
  <div class="s-table" v-if="isShowTable">
    <n-data-table
      ref="tableElRef"
      v-bind="getBindValues"
      :pagination="pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
    >
      <template v-for="item in Object.keys($slots)" :key="item" #[item]="data">
        <slot v-bind="data" :name="item"></slot>
      </template>
    </n-data-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, toRaw, computed, onMounted, nextTick } from 'vue';

  import { createTableContext } from './hooks/useTableContext';
  import ColumnSetting from './components/settings/ColumnSetting.vue';

  import { useLoading } from './hooks/useLoading';
  import { useColumns } from './hooks/useColumns';
  import { useDataSource } from './hooks/useDataSource';
  import { usePagination } from './hooks/usePagination';

  import { basicProps } from './props';
  import { BasicTableProps } from './types/table';

  import { getViewportOffset } from '@/utils/domUtils';
  import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn';
  import { isBoolean } from '@/utils/is';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';
  import { ReloadOutlined, ColumnHeightOutlined, QuestionCircleOutlined } from '@vicons/antd';

  const props = defineProps({
    ...basicProps,
  });

  const emit = defineEmits([
    'fetch-success',
    'fetch-error',
    'update:checked-row-keys',
    'edit-end',
    'edit-cancel',
    'edit-row-end',
    'edit-change',
  ]);

  const densityOptions = [
    {
      type: 'menu',
      label: '紧凑',
      key: 'small',
    },
    {
      type: 'menu',
      label: '默认',
      key: 'medium',
    },
    {
      type: 'menu',
      label: '宽松',
      key: 'large',
    },
  ];

  const isShowTable = ref(true);
  const deviceHeight = ref(150);
  const tableElRef = ref(null);
  const wrapRef = ref(null);
  let paginationEl: HTMLElement | null;

  const tableData = ref<Recordable[]>([]);
  const innerPropsRef = ref<Partial<BasicTableProps>>();

  const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
  });

  const { getAppTheme } = useDesignSetting();

  const { getLoading, setLoading } = useLoading(getProps);

  const { getPaginationInfo, setPagination } = usePagination(getProps);

  const {
    getDataSourceRef,
    getRowKey,
    reload,
    restReload,
    setTableData,
    getDataSource,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
  } = useDataSource(
    getProps,
    {
      getPaginationInfo,
      setPagination,
      tableData,
      setLoading,
    },
    emit
  );

  const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } =
    useColumns(getProps);

  const tableSize = ref(unref(getProps as any).size || 'medium');
  const isColumnSetting = ref(false);

  //页码切换
  function updatePage(page) {
    setPagination({ page: page });
    reload();
  }

  //分页数量切换
  function updatePageSize(size) {
    setPagination({ page: 1, pageSize: size });
    reload();
  }

  //密度切换
  function densitySelect(e) {
    tableSize.value = e;
  }

  //获取表格大小
  const getTableSize = computed(() => tableSize.value);

  //计算高度
  const getDeviceHeight = computed(() => {
    const tableData = unref(getDataSourceRef);
    const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto';
    return maxHeight;
  });

  //组装表格信息
  const getBindValues = computed(() => {
    const tableData = unref(getDataSourceRef);
    return {
      ...unref(getProps),
      loading: unref(getLoading),
      columns: toRaw(unref(getPageColumns)),
      rowKey: unref(getRowKey),
      data: tableData,
      size: unref(getTableSize),
      remote: true,
      'max-height': getDeviceHeight.value,
    };
  });

  //重新计算表格高度
  function redoHeight() {
    computeTableHeight();
  }

  //获取分页信息
  const pagination = computed(() => toRaw(unref(getPaginationInfo)));

  function setProps(props: Partial<BasicTableProps>) {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props };
  }

  const tableAction = {
    reload,
    restReload,
    redoHeight,
    setColumns,
    setLoading,
    setProps,
    getColumns,
    getPageColumns,
    getCacheColumns,
    setCacheColumnsField,
    emit,
  };

  createTableContext({ ...tableAction, wrapRef, getBindValues, isShowTable });

  const getCanResize = computed(() => {
    const { canResize } = unref(getProps);
    return canResize;
  });

  async function computeTableHeight() {
    const table = unref(tableElRef);
    if (!table) return;
    if (!unref(getCanResize)) return;
    const tableEl: any = table?.$el;
    await nextTick();
    const headEl = tableEl.querySelector('.n-data-table-thead ');
    const { bottomIncludeBody } = getViewportOffset(headEl);
    const headerH = 64;
    let paginationH = 2;
    let marginH = 20;
    if (!isBoolean(pagination)) {
      paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement;
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight;
        paginationH += offsetHeight || 0;
      } else {
        paginationH += 28;
      }
    }
    let height =
      bottomIncludeBody - (headerH + paginationH + marginH + (props.resizeHeightOffset || 0));
    const maxHeight = props.maxHeight;
    height = maxHeight && maxHeight < height ? maxHeight : height;
    deviceHeight.value = height;
  }

  useWindowSizeFn(computeTableHeight, 280);

  onMounted(() => {
    nextTick(() => {
      computeTableHeight();
    });
  });

  //导出方法到外部使用
  defineExpose({
    reload,
    restReload,
    getDataSource,
    getColumns,
    setColumns,
    setTableData,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    redoHeight,
  });
</script>
<style lang="less" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 16px 0;

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        font-weight: 600;
      }
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      flex: 1;

      &-icon {
        margin-left: 12px;
        font-size: 16px;
        cursor: pointer;
        color: var(--text-color);

        :hover {
          color: v-bind(getAppTheme);
        }
      }
    }
  }

  .table-toolbar-inner-popover-title {
    padding: 2px 0;
  }
</style>
