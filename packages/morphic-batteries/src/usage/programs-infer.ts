import { HKT2, Kind, Kind2, URIS, URIS2 } from '@morphic-ts/common/lib/HKT'
import { Algebra1, Algebra2, Algebra } from '@morphic-ts/algebras/lib/core'
import { ProgramURI, ProgramAlgebra, ProgramAlgebraURI, ProgramType } from './ProgramType'
import { AnyConfigEnv } from './summoner'

/**
 *  @since 0.0.1
 */
export const overloadsSymb = Symbol()
/**
 *  @since 0.0.1
 */
export const interpretable = <T extends { [overloadsSymb]?: any }>(program: T): Overloads<T> => program as Overloads<T>

/**
 *  @since 0.0.1
 */
export type InferredAlgebra<F, PURI extends ProgramURI> = Algebra<ProgramAlgebraURI[PURI], F>
/**
 *  @since 0.0.1
 */
export type Overloads<I extends { [overloadsSymb]?: any }> = NonNullable<I[typeof overloadsSymb]>

type Only<A> = A & { [k in keyof any]: never }

/**
 *  @since 0.0.1
 */
export interface InferredProgram<R extends AnyConfigEnv, E, A, PURI extends ProgramURI> {
  <G>(a: ProgramAlgebra<G>[PURI]): HKT2<G, Only<R>, E, A>
  [overloadsSymb]?: {
    <G extends URIS>(a: Algebra1<ProgramAlgebraURI[PURI], G>): Kind<G, { [k in G & keyof R]: R[k] }, A>
    <G extends URIS2>(a: Algebra2<ProgramAlgebraURI[PURI], G>): Kind2<G, { [k in G & keyof R]: R[k] }, E, A>
  }
}

/***
 * Provides Program builder for the given Program type (Exposing a specific Algebra)
 */
/**
 *  @since 0.0.1
 */
export const makeDefine = <PURI extends ProgramURI>(_prog: PURI) => <R, E, A>(
  program: ProgramType<R, E, A>[PURI]
): Overloads<ProgramType<R, E, A>[PURI]> => program as any // White lie
