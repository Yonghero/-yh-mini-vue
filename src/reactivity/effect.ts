class ReactiveEffect {

  private _fn: Function

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run(){
    activeEffect = this
    return this._fn()
  }
}

let activeEffect
const targetMap = new Map()

export function track(target, key) {

  let depsMap = targetMap.get(target)

  if(!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let deps = depsMap.get(key)

  if(!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  deps.add(activeEffect)
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

  _effect.run()

  return _effect.run.bind(_effect)
}
