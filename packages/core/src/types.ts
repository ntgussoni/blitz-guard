import { Ctx, PromiseReturnType } from "blitz"
import { All, BasicAbilities } from "./const"
import { Static } from "runtypes"
import { Guard } from "./guard"
export type AbilityType<T> = Static<typeof BasicAbilities> | T

export type ResourceType<T> = T | Static<typeof All> | (string & {}) // Workaround to get autocompletion working https://github.com/microsoft/TypeScript/issues/29729

// Horrible hack: It extracts the models from prisma db types
// This should change with this https://github.com/prisma/prisma/issues/3545
export type PrismaModelsType<T> = keyof Omit<
  T,
  | "disconnect"
  | "connect"
  | "executeRaw"
  | "queryRaw"
  | "transaction"
  | "on"
  | "$disconnect"
  | "$connect"
  | "$executeRaw"
  | "$queryRaw"
  | "$transaction"
  | "$on"
  | "$use"
>

export type _CanType<T, R> = (
  ability: AbilityType<R>,
  resource: ResourceType<T>,
  guard?: (args: any) => Promise<boolean>,
) => void

export type _CannotType<T, R> = (
  ability: AbilityType<R>,
  resource: ResourceType<T>,
  guard?: (args: any) => Promise<boolean>,
) => void

export type CanType<T, R> = (
  ability: AbilityType<R>,
  resource: ResourceType<T>,
  ctx: Ctx,
  args: any,
) => Promise<boolean>

export type AbilitiesParamsType<T, R> = { can: _CanType<T, R>; cannot: _CannotType<T, R> }
export type IAbilities<T, R> = (ctx: Ctx, params: AbilitiesParamsType<T, R>) => Promise<void>
export type RuleType<T, R> = {
  behavior: boolean
  ability: AbilityType<R>
  resource: ResourceType<T>
  guard?(args: any): Promise<boolean>
}

export interface IGuard<T, R> {
  ability: IAbilities<T, R>
  getRules(): RuleType<T, R>[]
  can(ability: AbilityType<R>, resource: ResourceType<T>, ctx: Ctx, args: any): Promise<boolean>
}

export interface IAuthorize<T, A> {
  <U, W extends Promise<any>, R extends (args: U, ctx: Ctx) => W, TResult = PromiseReturnType<R>>(
    ability: AbilityType<A>,
    resource: ResourceType<T>,
    resolver: (args: U, ctx: Ctx) => W,
  ): (args: U, ctx: Ctx) => Promise<TResult>
}

export type useGuardInputType<T, R> = [AbilityType<R>, ResourceType<T>, {}?]

export interface IGetAbility<T, R> {
  (rules: useGuardInputType<T, R>[], ctx: Ctx): Promise<boolean[]>
}

export interface IGuardBuilder<T, R> {
  instance: Guard<T, R>
  can: Guard<T, R>["can"]
  authorize: IAuthorize<T, R>
  getAbility: IGetAbility<T, R>
}
