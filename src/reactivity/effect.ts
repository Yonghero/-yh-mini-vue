import { extend } from "../shared"
let activeEffect
let shouldTrack

class ReactiveEffect {

  private _fn: Function
  deps = []
  active = true
  onStop?: () => void

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run(){
    if(!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this

    const result = this._fn()
    
    shouldTrack = false

    return result
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
  effect.deps.length = 0
}

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

  // 被stop的effect 不需要再次收集
  if(!shouldTrack) return

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
