import { PrismaClient } from "@prisma/client"
import { Ctx } from "blitz"
import { Literal, Static, Union } from "runtypes"

/*
create, read, update, delete, manage
*/

export const GuardPrismaActions = Union(
  Literal("findOne"),
  Literal("findMany"),
  Literal("create"),
  Literal("update"),
  Literal("updateMany"),
  Literal("upsert"),
  Literal("delete"),
  Literal("deleteMany"),
  Literal("executeRaw"),
  Literal("queryRaw"),
  Literal("aggregate"),
)

export const BasicAbilities = Union(
  Literal("create"),
  Literal("read"),
  Literal("update"),
  Literal("delete"),
  Literal("manage"),
)

export type AbilityType = Static<typeof BasicAbilities> | (string & {})

const isAbility = (ruleAbility: AbilityType, ability: AbilityType) =>
  ruleAbility === (ability as AbilityType)

// This should change with this https://github.com/prisma/prisma/issues/3545
export type ResourceType =
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

export interface IGuard {
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

interface GuardConstructor {
  new (abilities: IAbilities): IGuard
}

const Guard: GuardConstructor = class Guard implements IGuard {
  rules: IGuard["rules"] = []
  abilities: IGuard["abilities"]

  constructor(abilities: IAbilities) {
    this.abilities = abilities
  }

  // La ultima regla es la que importa?
  test = async (ctx: Ctx, args: any, ability: AbilityType, resource: ResourceType) => {
    const sanitizedResource = String(resource).toLowerCase()
    try {
      await this.abilities(ctx, this)
    } catch (e) {
      throw new Error(`GUARD: You should not throw errors in the ability file \n\r ${e}`)
    }
    const reversedRules = this.rules.reverse()
    let can = true
    for (let i = 0; i < reversedRules.length; i++) {
      const rule = reversedRules[i]

      const matchAll = rule.resource === "all" && rule.ability === "manage"

      if (matchAll) {
        can = rule.behavior
        break
      }

      if (rule.resource === sanitizedResource && isAbility(rule.ability, ability)) {
        if (rule.guard) {
          if (await rule.guard(args)) {
            can = rule.behavior
          } else {
            continue
          }
        } else {
          can = rule.behavior
        }

        break
      }
    }
    return can
  }

  // making them an arrow function allows spread
  can = (
    ability: AbilityType,
    resource: ResourceType,
    guard: (params: any) => Promise<boolean>,
  ) => {
    this.rules = [...this.rules, { behavior: true, ability, resource, guard }]
  }

  cannot = (
    ability: AbilityType,
    resource: ResourceType,
    guard: (params: any) => Promise<boolean>,
  ) => {
    this.rules = [...this.rules, { behavior: false, ability, resource, guard }]
  }
}

// Singleton
export const GuardInit = (abilities: IAbilities) => new Guard(abilities)
