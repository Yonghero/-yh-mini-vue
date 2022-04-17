import { computed } from "../computed"
import { reactive } from "../reactive"

describe('computed', () => {
  it('happy path', () => {
    const bbj = reactive({
      age: 1
    })
    const age = computed(() => {
      return bbj.age
    })

    expect(age.value).toBe(1)
  })


  it('should computed lazy', () => {
    const value = reactive({
      foo: 1
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    
    const cValue = computed(getter)

    // lazy 
    expect(getter).not.toHaveBeenCalled()
    // computed只有被用到时才会触发getter
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // computed依赖的值不变 getter不会被重新调用
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    value.foo = 2
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

  })
})
