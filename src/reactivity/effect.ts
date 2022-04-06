import { extend } from "../shared"

class ReactiveEffect {

  private _fn: Function
  deps = []
  active = true
  onStop?: () => void

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run(){
    activeEffect = this
    return this._fn()
  }

  stop() {
    if(this.active) {
      cleanupEffect(this)
      if(this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep:any) => {
    dep.delete(effect)
  })
}

let activeEffect
const targetMap = new Map()

export function track(target, key) {

  let depsMap = targetMap.get(target)

  if(!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if(!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 仅仅是get值 而不是在effect函数里收集的
  if(!activeEffect) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)

  for (const dep of deps) {
    if(dep.scheduler) {
      dep.scheduler()
    }else {
      dep.run()
    }
  }
}


export function effect(fn, options:any = {}) {

  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)

  _effect.run()

  const runner:any =_effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
