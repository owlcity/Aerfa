import type { PaginationProps } from '../types/pagination';
import type { BasicTableProps } from '../types/table';
import { computed, unref, ref, ComputedRef, watchEffect } from 'vue';

import { isBoolean } from '@/utils/is';
import { APISETTING, DEFAULTPAGESIZE, PAGESIZES } from '../const';

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({});
  const show = ref(true);

  watchEffect(() => {
    const { pagination } = unref(refProps);
    if (!isBoolean(pagination) && pagination) {
      configRef.value = {
        ...unref(configRef),
        ...(pagination ?? {}),
      };
    }
  });

  const getPaginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(refProps);
    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }
    const { totalField } = APISETTING;
    const pageCount = unref(configRef)[totalField] || undefined;
    return pageCount
      ? {
          page: 1, //当前页
          pageSize: DEFAULTPAGESIZE, //分页大小
          pageSizes: PAGESIZES, // 每页条数
          showSizePicker: true,
          showQuickJumper: true,
          prefix: () => `共 ${pageCount} 条`, // 不需要可以通过 pagination 重置或者删除
          ...(isBoolean(pagination) ? {} : pagination),
          ...unref(configRef),
          pageCount,
        }
      : false;
  });

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo);
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  }

  function getPagination() {
    return unref(getPaginationInfo);
  }

  function getShowPagination() {
    return unref(show);
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  return { getPagination, getPaginationInfo, setShowPagination, getShowPagination, setPagination };
}
