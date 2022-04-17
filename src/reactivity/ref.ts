import { isObject } from './../shared/index';
import { hasChanged } from "../shared"
import { isTracking, trackEffect, triggerEffect } from "./effect"
import { reactive } from './reactive';

class RefImpl{

  private _value
  private _rawValue
  private dep = new Set()

  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {

    if(hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffect(this.dep)
    }
  }
}

export function ref(value) {
  return new RefImpl(value)
}

function trackRefValue(ref) {
  if(isTracking()) {
    trackEffect(ref.dep)
  }
}

function convert(value) {
 return isObject(value) ? reactive(value) : value
}
