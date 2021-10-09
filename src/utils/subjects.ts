import { BehaviorSubject, ReplaySubject } from 'rxjs';

// 处理LoadingBar状态，只保留最后的状态
export const loadingSubject = new BehaviorSubject('start');
// 处理Message信息，缓存最后两个
export const messageSubject = new ReplaySubject(2);
// 处理Modal信息，缓存最后两个
export const modalSubject = new ReplaySubject(2);

export const $loading = {
  start: () => loadingSubject.next('start'),
  finish: () => loadingSubject.next('finish'),
  error: () => loadingSubject.next('error'),
};

export const $message = {
  success: (payload) =>
    messageSubject.next({
      type: 'success',
      info: payload,
    }),
  info: (payload) =>
    messageSubject.next({
      type: 'info',
      info: payload,
    }),
  warning: (payload) =>
    messageSubject.next({
      type: 'warning',
      info: payload,
    }),
  error: (payload) =>
    messageSubject.next({
      type: 'error',
      info: payload,
    }),
  loading: (payload) =>
    messageSubject.next({
      type: 'loading',
      info: payload,
    }),
};

export const $modal = {
  info: (payload) =>
    modalSubject.next({
      type: 'info',
      params: payload,
    }),
  warning: (payload) =>
    modalSubject.next({
      type: 'warning',
      params: payload,
    }),
};
