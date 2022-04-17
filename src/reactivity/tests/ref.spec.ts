import { effect } from '../effect'
import { ref } from '../ref'

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
  
})
