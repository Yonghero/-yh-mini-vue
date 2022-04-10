import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key) {

    if(key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }else if(key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    if (!isReadonly) {
      track(target, key)
    }

    return Reflect.get(target, key)
  }
}


function createSetter(){
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
