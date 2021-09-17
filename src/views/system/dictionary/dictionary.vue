<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="字典管理">
        可代替后台管理系统，设置的大量枚举值，统一标准化管理
      </n-card>
    </div>
    <n-grid class="mt-4" cols="1 s:1 m:1 l:3 xl:3 2xl:3" responsive="screen" :x-gap="12">
      <n-gi span="1" class="mb-4">
        <n-card :segmented="{ content: 'hard' }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-button type="primary">新建</n-button>
              <n-button type="primary" :disabled="!selectedKey">修改</n-button>
              <n-button type="error">删除</n-button>
            </n-space>
          </template>
          <n-table :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th width="60">ID</th>
                <th>字典名称</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <n-spin v-if="loading" size="medium" />
                  <n-tree
                    v-else
                    block-line
                    draggable
                    :data="treeData"
                    @update:selected-keys="selectedTree"
                    selectable
                  />
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-card>
      </n-gi>
      <n-gi span="2">
        <n-card :bordered="false" class="mb-4 proCard">
          <BasicTable
            :columns="columns"
            :request="loadDataTable"
            :row-key="(row) => row.id"
            ref="tableRef"
            :actionColumn="actionColumn"
            :scroll-x="1090"
          >
            <template #tableTitle>
              <n-space>
                <n-input type="text" />
                <n-button type="primary">查询</n-button>
                <n-button type="primary" :disabled="!selectedKey">新建</n-button>
                <n-button type="error">删除</n-button>
              </n-space>
            </template>
          </BasicTable>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, reactive, h, onMounted } from 'vue';
  import { renderIcon } from '@/utils/index';
  import { OptionsSharp } from '@vicons/ionicons5';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getDictionary, getDictionaryInfo } from '@/api/system/dictionary';
  import { columns } from './columns';

  const formParams = reactive({
    name: '',
    address: '',
    date: null,
  });

  const params = ref({
    pageSize: 10,
    name: 'xiaoMa',
  });
  const tableRef = ref();
  const loading = ref(true);
  const selectedKey = ref('');
  const treeData = ref(<any>[]);

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'text',
        actions: [
          {
            label: '删除',
            icon: 'ic:outline-delete-outline',
            onClick: handleDelete.bind(null, record),
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
          },
        ],
      });
    },
  });

  function reloadTable() {
    tableRef.value.reload();
  }

  const loadDataTable = async (res) => {
    const key = selectedKey.value.length ? selectedKey.value[0] : '';
    return await getDictionaryInfo({ ...res, ...formParams, ...params.value, key });
  };

  function selectedTree(key: string) {
    console.log(key)
    selectedKey.value = key;
    reloadTable()
  }

  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    router.push({ name: 'basic-info', params: { id: record.id } });
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }

  function handleSubmit(values: Recordable) {
    console.log(values);
    reloadTable();
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }

  async function init(){
    const res = await getDictionary();
    treeData.value = res;
    loading.value = false;
  }

  onMounted(() => {
    init()
  })

</script>
