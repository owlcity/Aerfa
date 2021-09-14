<template>
  <slot></slot>
</template>

<script lang="ts" setup>
  import { useMessage, useDialog, useLoadingBar } from 'naive-ui';
  import { loadingSubject, messageSubject, modalSubject } from '@/utils/subjects';

  const loadingBar = useLoadingBar();
  const message = useMessage();
  const dialog = useDialog();

  loadingSubject.subscribe({
    next: (status) => {
      if (status == 'start') {
        loadingBar.start();
      } else if (status == 'error') {
        loadingBar.error();
      } else {
        loadingBar.finish();
      }
    },
  });

  messageSubject.subscribe((event: any) => {
    if (event.type == 'success') {
      message.success(event.info);
    } else {
      message.error(event.info);
    }
  });

  modalSubject.subscribe((event: any) => {
    if (event.type == 'info') {
      dialog.info(event.params);
    } else {
      dialog.warning(event.params);
    }
  });
</script>
