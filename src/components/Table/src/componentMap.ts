import type { Component } from 'vue';
import {
  NInput,
  NSelect,
  NCheckbox,
  NInputNumber,
  NSwitch,
  NDatePicker,
  NTimePicker,
  NCascader,
} from 'naive-ui';
import type { ComponentType } from './types/componentType';

export enum EventEnum {
  NInput = 'on-input',
  NInputNumber = 'on-update:value',
  NSelect = 'on-update:value',
  NSwitch = 'on-update:value',
  NCheckbox = 'on-update:value',
  NDatePicker = 'on-update:value',
  NTimePicker = 'on-update:value',
  NCascader = 'on-update:value',
}

const componentMap = new Map<ComponentType, Component>();

componentMap.set('NInput', NInput);
componentMap.set('NInputNumber', NInputNumber);
componentMap.set('NSelect', NSelect);
componentMap.set('NSwitch', NSwitch);
componentMap.set('NCheckbox', NCheckbox);
componentMap.set('NDatePicker', NDatePicker);
componentMap.set('NTimePicker', NTimePicker);
componentMap.set('NCascader', NCascader);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
