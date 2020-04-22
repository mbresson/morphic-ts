import { URIS, URIS2, Kind, Kind2 } from './HKT'
import { identity } from 'fp-ts/lib/function'
export { Kind, Kind2 }

/**
 * generates a config wrapper:
 *
 * Example:
 *
 * ```typescript
 *   const eqConfig = genConfig(EqURI)
 * ```
 *
 * Usage:
 *
 * ```typescript
 *   summonAs(F => F.unknown(eqConfig({ compare: 'default-circular' })))
 *   summonAs(F => F.unknown({...eqConfig({ compare: 'default-circular' }), ...iotsConfig(x => x)}))
 * ```
 *
 *  @since 0.0.1
 */

export type AnyEnv = Partial<Record<URIS | URIS2, any>>

/**
 *  @since 0.0.1
 */
export interface GenConfig<A, R> {
  (a: A, r: R): A
}

/**
 *  @since 0.0.1
 */
export type NoEnv = unknown

/**
 *  @since 0.0.1
 */
export type MapToGenConfig<R extends AnyEnv, T extends Record<URIS | URIS2, any>> = {
  [k in URIS | URIS2]?: GenConfig<T[k], R[k]>
}

/**
 *  @since 0.0.1
 */
export interface ConfigType<E, A> {
  _E: E
  _A: A
}

/**
 *  @since 0.0.1
 */
export type ConfigsForType<R, E, A> = MapToGenConfig<R, ConfigType<E, A>>

/**
 *  @since 0.0.1
 */
export const genConfig: <Uri extends URIS | URIS2>(
  uri: Uri
) => <R, E, A>(
  config: GenConfig<ConfigType<E, A>[Uri], R>
) => { [k in Uri]: GenConfig<ConfigType<E, A>[Uri], R> } = uri => config =>
  ({
    [uri]: config
  } as any)

/**
 *  @since 0.0.1
 */
export const getApplyConfig: <Uri extends URIS | URIS2>(
  uri: Uri
) => <E, A, R extends Record<typeof uri, any>>(
  config: { [k in Uri]?: GenConfig<ConfigType<E, A>[Uri], R> }
) => GenConfig<ConfigType<E, A>[Uri], R> = uri => config => (a, r) =>
  ((config[uri] ? config[uri] : identity) as any)(a, r[uri])
