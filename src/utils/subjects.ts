import { BehaviorSubject, ReplaySubject } from 'rxjs';

// 处理LoadingBar状态，只保留最后的状态
export const loadingSubject = new BehaviorSubject('start');

// 处理Message信息，缓存最后两个
export const messageSubject = new ReplaySubject(2);

// 处理Modal信息，缓存最后两个
export const modalSubject = new ReplaySubject(2);
