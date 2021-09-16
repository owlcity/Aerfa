<template>
  <div>
    <n-card :bordered="false" class="pt-3 mb-4 proCard">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </BasicForm>
    </n-card>
    <n-card :bordered="false" class="mb-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        scroll-x="1200"
        virtual-scroll
      >
        <template #tableTitle>
          <n-space>
            <n-button type="primary" @click="addUser">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新建
            </n-button>
            <n-button type="error" @click="addTable">
              <template #icon>
                <n-icon>
                  <DeleteOutlined />
                </n-icon>
              </template>
              删除
            </n-button>
            <n-button @click="addTable">
              <template #icon>
                <n-icon>
                  <ToTopOutlined />
                </n-icon>
              </template>
              导入
            </n-button>
          </n-space>
        </template>
      </BasicTable>
    </n-card>

    <basicModal
      @register="modalRegister"
      ref="modalRef"
      class="basicModal basicFormModal"
      @on-ok="okModal"
    >
      <template #default>
        <BasicForm @register="registerForm" @reset="handleReset" class="basicForm">
          <template #statusSlot="{ model, field }">
            <n-input v-model:value="model[field]" />
          </template>
        </BasicForm>
      </template>
    </basicModal>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { getUserList } from '@/api/system/user';
  import { columns } from './columns';
  import { PlusOutlined, DeleteOutlined, ToTopOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { basicModal, useModal } from '@/components/Modal';

  const rules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入名称',
    },
    address: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入地址',
    },
    date: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择日期',
    },
  };

  const schemas = [
    {
      field: 'username',
      component: 'NInput',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      field: 'account',
      component: 'NInput',
      label: '登录账号',
      componentProps: {
        placeholder: '请输入登录账号',
      },
    },
    {
      field: 'mobile',
      component: 'NInputNumber',
      label: '手机',
      componentProps: {
        placeholder: '请输入手机号码',
        showButton: false,
      },
    },
    {
      field: 'role',
      component: 'NSelect',
      label: '角色',
      componentProps: {
        placeholder: '请选择角色',
        options: [
          {
            label: '普通用户',
            value: 1,
          },
          {
            label: '推广管理员',
            value: 2,
          },
          {
            label: '发货管理员',
            value: 3,
          },
          {
            label: '财务管理员',
            value: 4,
          },
        ],
      },
    },
    {
      field: 'email',
      component: 'NInput',
      label: '邮箱',
      componentProps: {
        placeholder: '请输入邮箱',
        showButton: false,
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择角色',
        options: [
          {
            label: '正常',
            value: 'normal',
          },
          {
            label: '禁用',
            value: 'disable',
          },
        ],
      },
    },
  ];

  const router = useRouter();
  const formRef: any = ref(null);
  const message = useMessage();
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    name: '',
    address: '',
    date: null,
  });

  const params = ref({
    pageSize: 10,
    name: 'xiaoma',
  });

  const actionColumn = reactive({
    width: 170,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'text',
        actions: [
          {
            label: '删除',
            icon: 'ic:outline-delete-outline',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['basic_list'],
          },
        ],
        dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return true;
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return true;
            },
          },
        ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  const [register, {}] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  function addTable() {
    showModal.value = true;
  }

  const loadDataTable = async (res) => {
    return await getUserList({ ...res, ...formParams, ...params.value });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        message.success('新建成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      } else {
        message.error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
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

  const [registerForm, { submit }] = useForm({
    gridProps: { cols: 2 },
    collapsed: false,
    collapsedRows: 12,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '确定',
    showActionButtonGroup: false,
    schemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '添加会员',
    width: 650,
  });

  function addUser() {
    openModal();
  }
  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      closeModal();
      message.success('提交成功');
    } else {
      message.error('验证失败，请填写完整信息');
      setSubLoading(false);
    }
  }
</script>

<style lang="less" scoped></style>
