import { readonly } from "../reactive"

describe('readonly', () => {
  it('happy path', () => {
    const raw = { foo: 1}
    const readRaw = readonly(raw)

    expect(readRaw).not.toBe(raw)
    expect(readRaw.foo).toBe(1)
  })

  it('when set give warn' , () => {
    console.warn = jest.fn()

    const readRaw = readonly({ foo: 1})

    readRaw.foo = 1

    expect(console.warn).toBeCalledTimes(1)
  })
})
