<template>
  <div
    ref="basicTableRef"
    :class="{
      'table-full-screen': isFullscreen && !getDarkTheme,
    }"
  >
    <div class="table-toolbar">
      <!--顶部左侧区域-->
      <div class="flex items-center table-toolbar-left">
        <template v-if="tableTitle">
          <div class="table-toolbar-left-title">
            {{ tableTitle }}
            <n-tooltip v-if="tableTitleTooltip" trigger="hover">
              <template #trigger>
                <n-icon class="ml-1 text-gray-400 cursor-pointer" size="18">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ tableTitleTooltip }}
            </n-tooltip>
          </div>
        </template>
        <slot name="tableTitle"></slot>
      </div>

      <div class="flex items-center table-toolbar-right">
        <!--顶部右侧区域-->
        <slot name="toolbar"></slot>

        <template v-if="isTableSetting">
          <!--表格斑马纹-->
          <n-tooltip trigger="hover" v-if="isShowTableStriped">
            <template #trigger>
              <div class="mr-2 table-toolbar-right-icon">
                <n-switch v-model:value="striped" />
              </div>
            </template>
            <span>表格斑马纹</span>
          </n-tooltip>

          <n-divider vertical v-if="isShowTableStriped" />

          <!--查询-->
          <n-tooltip trigger="hover" v-if="isShowTableQuery">
            <template #trigger>
              <div class="table-toolbar-right-icon" @click="foldQueryChange">
                <n-icon size="18">
                  <SearchOutlined />
                </n-icon>
              </div>
            </template>
            <span>{{ foldQuery ? '展开查询' : '收起查询' }}</span>
          </n-tooltip>

          <!--刷新-->
          <n-tooltip trigger="hover" v-if="isShowTableRedo">
            <template #trigger>
              <div class="table-toolbar-right-icon" @click="reloadTable">
                <n-icon size="18">
                  <ReloadOutlined />
                </n-icon>
              </div>
            </template>
            <span>刷新</span>
          </n-tooltip>

          <!--密度-->
          <n-tooltip trigger="hover" v-if="isShowTableSize">
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
          <ColumnSetting v-if="isShowTableSetting" />

          <!--全屏-->
          <n-tooltip trigger="hover" v-if="isShowTableFullscreen">
            <template #trigger>
              <div class="table-toolbar-right-icon" @click="toggleTableFullScreen">
                <n-icon size="18">
                  <FullscreenExitOutlined v-if="isFullscreen" />
                  <FullscreenOutlined v-else />
                </n-icon>
              </div>
            </template>
            <span>{{ isFullscreen ? '还原' : '全屏' }}</span>
          </n-tooltip>
        </template>
      </div>
    </div>
    <div class="mb-4 table-checked-row" v-if="getCheckedRowAlert">
      <n-alert type="info" :show-icon="false">
        <n-space justify="space-between">
          <span>已选择 {{ checkedRowKeys.length }} 项</span>
          <n-button type="info" text @click="restCheckedRowKeys">取消选择</n-button>
        </n-space>
      </n-alert>
    </div>
    <div class="s-table" v-if="isShowTable">
      <n-data-table
        ref="tableElRef"
        v-bind="getBindValues"
        v-model:checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="checkedRowKeysChange"
        :pagination="pagination"
        @update:page="updatePage"
        @update:page-size="updatePageSize"
      >
        <template v-for="item in Object.keys($slots)" :key="item" #[item]="data">
          <slot v-bind="data" :name="item"></slot>
        </template>
      </n-data-table>
    </div>
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
  import {
    ReloadOutlined,
    ColumnHeightOutlined,
    QuestionCircleOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    SearchOutlined,
  } from '@vicons/antd';
  import { useFullscreen } from '@vueuse/core';

  const props = defineProps({
    ...basicProps,
  });

  const emit = defineEmits([
    'fetch-success',
    'fetch-error',
    'checked-row-change',
    'edit-end',
    'edit-cancel',
    'edit-row-end',
    'edit-change',
    'fold-query-change',
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

  const foldQuery = ref(false);
  const striped = ref(false);
  const isShowTable = ref(true);
  const deviceHeight = ref<Number | String>('auto');
  const tableElRef = ref<HTMLElement | null>(null);
  const basicTableRef = ref<HTMLElement | null>(null);
  const wrapRef = ref(null);
  const checkedRowKeys = ref<any>([]);
  let paginationEl: HTMLElement | null;

  const tableData = ref<Recordable[]>([]);
  const innerPropsRef = ref<Partial<BasicTableProps>>();

  const { isFullscreen, toggle } = useFullscreen(basicTableRef);

  const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
  });

  const tableTitle = unref(getProps).title || '';

  const tableTitleTooltip = unref(getProps).titleTooltip || '';

  const { getAppTheme, getDarkTheme } = useDesignSetting();

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

  //是否显示 选中行提示
  const getCheckedRowAlert = computed(() => {
    return unref(getProps as any).checkedRowAlert && checkedRowKeys.value.length;
  });

  //表格全屏
  function toggleTableFullScreen() {
    toggle();
  }

  //table内部刷新
  async function reloadTable() {
    await restCheckedRowKeys();
    reload();
  }

  //页码切换
  async function updatePage(page) {
    await restCheckedRowKeys();
    setPagination({ page: page });
    reload();
  }

  //分页数量切换
  function updatePageSize(size) {
    console.log('🚀 ~ file: Table.vue ~ line 272 ~ updatePageSize ~ size', size);
    setPagination({ page: 1, pageSize: size });
    reload();
  }

  //密度切换
  function densitySelect(e) {
    tableSize.value = e;
  }

  //获取表格大小
  const getTableSize = computed(() => tableSize.value);

  //获取斑马纹
  const getStriped = computed(() => striped.value);

  //表格设置工具
  const isTableSetting = computed(() => getProps.value.showTableSetting);

  //是否显示刷新按钮
  const isShowTableRedo = computed(() => getProps.value.tableSetting?.redo ?? true);

  //是否显示尺寸调整按钮
  const isShowTableSize = computed(() => getProps.value.tableSetting?.size ?? true);

  //是否显示字段调整按钮
  const isShowTableSetting = computed(() => getProps.value.tableSetting?.setting ?? true);

  //是否显示表格全屏按钮
  const isShowTableFullscreen = computed(() => getProps.value.tableSetting?.fullscreen ?? true);

  //是否显示斑马纹开关
  const isShowTableStriped = computed(() => getProps.value.tableSetting?.striped ?? true);

  //是否显示查询表单 AdvancedTable 组件独有
  const isShowTableQuery = computed(() => getProps.value.tableSetting?.query ?? true);

  //计算高度
  const getDeviceHeight = computed(() => {
    const tableData = unref(getDataSourceRef);
    if (deviceHeight.value === 'auto') return 'auto';
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
      striped: unref(getStriped),
      remote: true,
      'max-height': getDeviceHeight.value,
    };
  });

  //折叠查询
  function foldQueryChange() {
    foldQuery.value = !foldQuery.value;
    emit('fold-query-change', foldQuery.value);
  }

  //选择行
  function checkedRowKeysChange(rowKeys) {
    checkedRowKeys.value = rowKeys;
    emit('checked-row-change', checkedRowKeys);
    redoHeight();
  }

  //清空行
  function restCheckedRowKeys() {
    checkedRowKeys.value = [];
    emit('checked-row-change', checkedRowKeys);
    redoHeight();
  }

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
    restCheckedRowKeys,
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
    const table: any = unref(tableElRef);
    if (!table) return;
    if (!unref(getCanResize)) return;
    const tableEl: any = table?.$el;
    await nextTick();
    const headEl = tableEl.querySelector('.n-data-table-thead ');
    const { bottomIncludeBody } = getViewportOffset(headEl);
    const headerH = 64;
    let paginationH = 2;
    let marginH = 22;
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
    restCheckedRowKeys,
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
        color: var(--n-text-color);

        :hover {
          color: v-bind(getAppTheme);
        }
      }
    }
  }

  .table-toolbar-inner-popover-title {
    padding: 2px 0;
  }

  .table-full-screen {
    background: #fff;
    padding: 20px;
  }
</style>
