<template>
  <basicModal
    @register="modalRegister"
    ref="modalRef"
    class="basicModal basicFormModal"
    @on-ok="okModal"
  >
    <template #default>
      <BasicForm @register="registerForm" class="basicForm pt-6">
        <template #passwordSlot="{ model, field }">
          <Password ref="passwordRef" v-model:value="model[field]" :required="false" block />
        </template>
        <template #rePasswordSlot="{ model, field }">
          <Password ref="passwordRef" v-model:value="model[field]" :required="false" block />
        </template>
      </BasicForm>
      <n-alert title="提示" type="warning"> 添加和编辑，均为Mock数据，非真实数据更新！ </n-alert>
    </template>
  </basicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { basicModal, useModal } from '@/components/Modal';
  import { Password } from '@/components/Password';
  import schemas from './modalSchemas.ts';
  import { useMessage } from 'naive-ui';

  const message = useMessage();

  const props = defineProps({
    title: {
      type: String,
      default: '添加用户',
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  });

  const title = ref(props.title);

  //创建form
  const [registerForm, { submit, setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    collapsed: false,
    collapsedRows: 12,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '确定',
    showActionButtonGroup: false,
    schemas,
  });

  //添加会员弹窗
  const [modalRegister, { openModal, closeModal, setSubLoading, setProps }] = useModal({
    title,
    subBtuText: '确定',
    width: 650,
  });

  //提交
  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      const { isEdit } = props;
      message.success(isEdit ? '修改成功' : '添加成功');
      closeModal();
    } else {
      message.error('验证失败，请填写完整信息');
      setSubLoading(false);
    }
  }

  //导出方法
  defineExpose({
    openModal,
    closeModal,
    setFieldsValue,
    setProps,
  });
</script>
