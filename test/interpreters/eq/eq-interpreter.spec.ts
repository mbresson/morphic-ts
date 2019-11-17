import * as chai from 'chai'

import { summon, summonAs } from '../../../src/utils/summoner-no-union'

describe('Eq', () => {
  it('returns false when comparing incomplete values', () => {
    const Foo = summonAs(F =>
      F.interface({
        date: F.date,
        a: F.string
      })
    )

    const { eq } = Foo

    const date = new Date(12345)
    chai.assert.strictEqual(eq.equals({ date, a: '' }, { date } as any), false)
  })

  it('eq', () => {
    const Foo = summonAs(F =>
      F.interface({
        date: F.date,
        a: F.string
      })
    )

    const { eq } = Foo

    const date = new Date(12345)
    const date2 = new Date(12346)
    chai.assert.strictEqual(eq.equals({ date, a: '' }, { date, a: '' }), true)
    chai.assert.strictEqual(eq.equals({ date, a: '' }, { date: date2, a: '' }), false)
  })

  it('eq', () => {
    const Foo = summonAs(F =>
      F.interface({
        dates: F.array(
          F.interface({
            date: F.date
          }),
          {}
        ),
        a: F.string
      })
    )

    const { eq } = Foo

    const date = new Date(12345)
    const date2 = new Date(12346)
    chai.assert.strictEqual(
      eq.equals({ dates: [{ date }, { date }], a: '' }, { dates: [{ date }, { date }], a: '' }),
      true
    )

    chai.assert.strictEqual(
      eq.equals({ dates: [{ date: date2 }, { date }], a: '' }, { dates: [{ date }, { date: date2 }], a: '' }),
      false
    )
  })

  it('partial', () => {
    interface Foo {
      type: 'foo'
      a: string
      b: number
    }
    const Foo = summonAs(F =>
      F.partial({
        type: F.stringLiteral('foo'),
        a: F.string,
        b: F.number
      })
    )

    const { eq } = Foo
    chai.assert.deepStrictEqual(eq.equals({}, {}), true)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, { type: 'foo' }), true)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, { type: 'foo', a: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo', a: 'foo' }, { type: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, { a: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({}, { type: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, {}), false)
  })

  it('taggedUnion', () => {
    interface Foo {
      type: 'foo'
      a: string
      b: number
    }
    const Foo = summon<Foo>(F =>
      F.interface({
        type: F.stringLiteral('foo'),
        a: F.string,
        b: F.number
      })
    )

    interface Bar {
      type: 'bar'
      c: string
      d: number
    }
    const Bar = summon<Bar>(F =>
      F.interface({
        type: F.stringLiteral('bar'),
        c: F.string,
        d: F.number
      })
    )

    const FooBar = summonAs(F =>
      F.taggedUnion('type', {
        foo: Foo(F),
        bar: Bar(F)
      })
    )

    const eq = FooBar.eq

    const fooA: Foo | Bar = { type: 'foo', a: 'a', b: 12 }
    const fooB: Foo | Bar = { type: 'foo', a: 'b', b: 12 }
    const fooC: Foo | Bar = { type: 'foo', a: 'a', b: 12 }

    const barA: Foo | Bar = { type: 'bar', c: 'a', d: 12 }
    const barB: Foo | Bar = { type: 'bar', c: 'b', d: 12 }

    chai.assert.deepStrictEqual(eq.equals(fooA, fooA), true)
    chai.assert.deepStrictEqual(eq.equals(fooA, fooC), true)
    chai.assert.deepStrictEqual(eq.equals(fooA, fooB), false)
    chai.assert.deepStrictEqual(eq.equals(fooA, barA), false)
    chai.assert.deepStrictEqual(eq.equals(barA, barB), false)
    chai.assert.deepStrictEqual(eq.equals(barB, barB), true)
  })
})
