import { isReactive, isReadonly, reactive, readonly }  from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1, hhh:{ a:1 } };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)

    expect(isReactive(observed.hhh)).toBe(true)
    expect(isReactive(original.hhh)).toBe(false)


    const readonlyObj = readonly(original)
    expect(isReadonly(observed)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(readonlyObj)).toBe(true)

    expect(isReadonly(readonlyObj.hhh)).toBe(true)
    expect(isReadonly(original.hhh)).toBe(false)
  });
});
