import { Ctx } from "blitz"
import { PrismaClient } from "@prisma/client"
import { Literal, Static } from "runtypes"
type ResolverType<U> = (args: U, ctx: Ctx) => any
declare const authorizeInit: (
  GuardInstance: IGuard,
) => <U>(
  ability: AbilityType,
  resource: ResourceType,
  resolver: ResolverType<U>,
) => (
  args: U,
  ctx: Ctx & {
    guardSecured: boolean
  },
) => Promise<any>
type AbilitiesType = [AbilityType, ResourceType, {}?][]
type GetAbilityType = (
  data: {
    abilities: AbilitiesType
  },
  ctx: Ctx,
) => Promise<boolean[]>
declare const useGuardInit: (
  getAbility: GetAbilityType,
) => (
  abilities: AbilitiesType,
) => [
  boolean[],
  {
    isLoading: boolean
  },
]
/*
create, read, update, delete, manage
*/
declare const GuardPrismaActions: import("runtypes").Union11<
  Literal<"findOne">,
  Literal<"findMany">,
  Literal<"create">,
  Literal<"update">,
  Literal<"updateMany">,
  Literal<"upsert">,
  Literal<"delete">,
  Literal<"deleteMany">,
  Literal<"executeRaw">,
  Literal<"queryRaw">,
  Literal<"aggregate">
>
declare const BasicAbilities: import("runtypes").Union5<
  Literal<"create">,
  Literal<"read">,
  Literal<"update">,
  Literal<"delete">,
  Literal<"manage">
>
type AbilityType = Static<typeof BasicAbilities> | (string & {})
// This should change with this https://github.com/prisma/prisma/issues/3545
type ResourceType =
  | keyof Omit<
      PrismaClient,
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
  | (string & {}) // Workaround to get autocompletion working https://github.com/microsoft/TypeScript/issues/29729
// eslint-disable-next-line no-use-before-define
type IAbilities = (ctx: Ctx, guardInstance: IGuard) => Promise<void>
interface IGuard {
  abilities: IAbilities
  rules: {
    behavior: boolean
    ability: AbilityType
    resource: ResourceType
    guard?(args: any): Promise<boolean>
  }[]
  test(ctx: Ctx, args: any, ability: AbilityType, resource: ResourceType): Promise<boolean>
  can(ability: AbilityType, resource: ResourceType, guard?: (args: any) => Promise<boolean>): void
  cannot(
    ability: AbilityType,
    resource: ResourceType,
    guard?: (args: any) => Promise<boolean>,
  ): void
}
// Singleton
declare const GuardInit: (abilities: IAbilities) => IGuard
export {
  authorizeInit,
  useGuardInit,
  GuardPrismaActions,
  BasicAbilities,
  AbilityType,
  ResourceType,
  IGuard,
  GuardInit,
}
