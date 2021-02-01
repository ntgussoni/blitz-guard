import { Ctx, PromiseReturnType } from "blitz"
import { All, BasicAbilities } from "./const"
import { Static } from "runtypes"
import { Guard } from "./guard"

export type AbilityType<IAbility> = Static<typeof BasicAbilities> | IAbility

export type ResourceType<IResource> = Static<typeof All> | IResource

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

export type _CanType<IResource, IAbility> = (
  ability: AbilityType<IAbility>,
  resource: ResourceType<IResource>,
  guard?: (args: any) => Promise<boolean>,
) => void

export type _CannotType<IResource, IAbility> = (
  ability: AbilityType<IAbility>,
  resource: ResourceType<IResource>,
  guard?: (args: any) => Promise<boolean>,
) => void

export type CanType<IResource, IAbility> = (
  ability: AbilityType<IAbility>,
  resource: ResourceType<IResource>,
  ctx: Ctx,
  args: any,
) => Promise<boolean>

export type AbilitiesParamsType<IResource, IAbility> = {
  can: _CanType<IResource, IAbility>
  cannot: _CannotType<IResource, IAbility>
}
export type IAbilities<IResource, IAbility> = (
  ctx: Ctx,
  params: AbilitiesParamsType<IResource, IAbility>,
) => Promise<void>
export type RuleType<IResource, IAbility> = {
  behavior: boolean
  ability: AbilityType<IAbility>
  resource: ResourceType<IResource>
  guard?(args: any): Promise<boolean>
}

export interface IGuard<IResource, IAbility> {
  ability: IAbilities<IResource, IAbility>
  getPreviouslyRanRules(): RuleType<IResource, IAbility>[]
  can(
    ability: AbilityType<IAbility>,
    resource: ResourceType<IResource>,
    ctx: Ctx,
    args: any,
  ): Promise<boolean>
}

export interface IAuthorize<IResource, IAbility> {
  <U, W extends Promise<any>, R extends (args: U, ctx: Ctx) => W, TResult = PromiseReturnType<R>>(
    ability: AbilityType<IAbility>,
    resource: ResourceType<IResource>,
    resolver: (args: U, ctx: Ctx) => W,
  ): (args: U, ctx: Ctx) => Promise<TResult>
}

export type useGuardInputType<IResource, IAbility> = [
  AbilityType<IAbility>,
  ResourceType<IResource>,
  {}?,
]

export interface IGetAbility<IResource, IAbility> {
  (rules: useGuardInputType<IResource, IAbility>[], ctx: Ctx): Promise<boolean[]>
}

export interface IGuardBuilder<IResource = any, IAbility = any> {
  instance: Guard<IResource, IAbility>
  can: Guard<IResource, IAbility>["can"]
  authorize: IAuthorize<IResource, IAbility>
  getAbility: IGetAbility<IResource, IAbility>
}
