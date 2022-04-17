import { effect } from '../effect'
import { isRef, proxyRefs, ref, unRef } from '../ref'

describe('ref', () => {
  it('happy path', () => {
    const number = ref(1)

    expect(number.value).toBe(1)
  })

  it('ref effect', () => {
    const number = ref(1)
    let dummy
    let calls = 0

    effect(() => {
      calls++
      dummy = number.value
    })

    expect(dummy).toBe(1)
    expect(calls).toBe(1)

    number.value = 2

    expect(dummy).toBe(2)
    expect(calls).toBe(2)

    number.value = 2

    expect(dummy).toBe(2)
    expect(calls).toBe(2)
  })

  it('ref nested object', () => {
    const refObj = ref({count: 1})
    let dummy
    effect(() => {
      dummy = refObj.value.count
    })

    expect(dummy).toBe(1)

    refObj.value.count++
    expect(dummy).toBe(2)
  })
  
  it('isRef unRef', () => {
    const a = ref(1)

    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)

    expect(unRef(a)).toBe(1)
  })

  it('proxyRefs usually use in template', () => {
    const user = {
      age: ref(10),
      name: 'bbj'
    }

    const proxyUser = proxyRefs(user)

    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)

    proxyUser.age = 20

    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyUser.age = ref(15)

    expect(proxyUser.age).toBe(15)
    expect(user.age.value).toBe(15)
  })
})
