import type { AnyEnv } from '@morphic-ts/common/lib/config'
import { memo } from '@morphic-ts/common/lib/utils'
import type { AnyNewtype, ModelAlgebraNewtype, NewtypeA } from '@morphic-ts/model-algebras/lib/newtype'
import { pipe } from 'fp-ts/lib/function'
import type { Show } from 'fp-ts/lib/Show'

import { showApplyConfig } from '../config'
import { ShowType, ShowURI } from '../hkt'

declare module '@morphic-ts/model-algebras/lib/newtype' {
  export interface NewtypeConfig<L, A, N> {
    [ShowURI]: {
      show: Show<A>
    }
  }
  export interface IsoConfig<L, A, N> {
    [ShowURI]: {
      show: Show<A>
    }
  }
  export interface PrismConfig<L, A, N> {
    [ShowURI]: {
      show: Show<A>
    }
  }
}

const coerce = <N extends AnyNewtype>(e: Show<NewtypeA<N>>): Show<N> => e as Show<N>

/**
 *  @since 0.0.1
 */
export const showNewtypeInterpreter = memo(
  <Env extends AnyEnv>(): ModelAlgebraNewtype<ShowURI, Env> => ({
    _F: ShowURI,
    newtype: name => (a, config) => env =>
      pipe(
        a(env).show,
        show =>
          new ShowType(showApplyConfig(config)(coerce({ show: x => `<${name}>(${show.show(x)})` }), env, { show }))
      ),
    newtypeIso: (iso, a, name, config) => env =>
      pipe(
        a(env).show,
        show =>
          new ShowType(
            showApplyConfig(config)({ show: x => `<${name}>(${show.show(iso.reverseGet(x))})` }, env, { show })
          )
      ),
    newtypePrism: (prism, a, name, config) => env =>
      pipe(
        a(env).show,
        show =>
          new ShowType(
            showApplyConfig(config)({ show: x => `<${name}>(${show.show(prism.reverseGet(x))})` }, env, { show })
          )
      )
  })
)
