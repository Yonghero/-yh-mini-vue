import { isReactive, isReadonly, reactive, readonly, isProxy }  from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)

    const readonlyObj = readonly(original)
    expect(isReadonly(observed)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(readonlyObj)).toBe(true)

    expect(isProxy(observed)).toBe(true)
    expect(isProxy(readonlyObj)).toBe(true)
  });
});
