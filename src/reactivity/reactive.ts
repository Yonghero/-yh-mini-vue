import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

export enum ReactiveFlags {
  IS_READONLY = '__v_isReadonly',
  IS_REACTIVE = '__v_isReactive'
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}


export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}


export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}
