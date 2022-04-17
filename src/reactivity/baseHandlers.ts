import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    if (!isReadonly) {
      track(target, key)
    }
    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    if (isObject(target[key])) {
      return isReadonly ? readonly(target[key]) : reactive(target[key])
    }

    return res
  }
}


function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key)
    return res
  }
}


export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key ${key} not to set readonly ${target}`)
    return true
  }
}


export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
