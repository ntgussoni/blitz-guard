import { Ctx } from "blitz"
import { Literal, Static, Union } from "runtypes"

const Manage = Literal("manage")
const All = Literal("all")

export const BasicAbilities = Union(
  Literal("create"),
  Literal("read"),
  Literal("update"),
  Literal("delete"),
  Manage,
)

export type AbilityType = Static<typeof BasicAbilities> | (string & {})

const isAbility = (ruleAbility: AbilityType, ability: AbilityType) =>
  ruleAbility === ability || ruleAbility === Manage.value

// This should change with this https://github.com/prisma/prisma/issues/3545
export type ResourceType<T> =
  | keyof Omit<
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
  | Static<typeof All>
  | (string & {}) // Workaround to get autocompletion working https://github.com/microsoft/TypeScript/issues/29729

const isResource = <T>(ruleResource: ResourceType<T>, resource: ResourceType<T>) =>
  ruleResource === resource || ruleResource === All.value

// eslint-disable-next-line no-use-before-define
type IAbilities<T> = (ctx: Ctx, guardInstance: IGuard<T>) => Promise<void>

export interface IGuard<T> {
  ability: IAbilities<T>
  rules: {
    behavior: boolean
    ability: AbilityType
    resource: ResourceType<T>
    guard?(args: any): Promise<boolean>
  }[]
  test(ctx: Ctx, args: any, ability: AbilityType, resource: ResourceType<T>): Promise<boolean>
  can(
    ability: AbilityType,
    resource: ResourceType<T>,
    guard?: (args: any) => Promise<boolean>,
  ): void
  cannot(
    ability: AbilityType,
    resource: ResourceType<T>,
    guard?: (args: any) => Promise<boolean>,
  ): void
}

const Guard = class Guard<T> implements IGuard<T> {
  rules: IGuard<T>["rules"] = []
  ability: IGuard<T>["ability"]

  constructor(ability: IAbilities<T>) {
    if (!ability) throw new Error("GUARD: Ability file not present")
    this.ability = ability
  }

  test = async (ctx: Ctx, args: any, ability: AbilityType, resource: ResourceType<T>) => {
    const sanitizedResource = String(resource).toLowerCase()

    if (!ctx) throw new Error("GUARD: ctx cannot be empty")
    if (!ability) throw new Error("GUARD: ability cannot be empty")
    if (!resource) throw new Error("GUARD: resource cannot be empty")

    try {
      await this.ability(ctx, this)
    } catch (e) {
      throw new Error(`GUARD: You should not throw errors in the ability file \n\r ${e}`)
    }
    const reversedRules = this.rules.reverse()
    let can = true
    for (let i = 0; i < reversedRules.length; i++) {
      const rule = reversedRules[i]

      const matchAll = rule.resource === All.value && rule.ability === Manage.value

      if (matchAll) {
        can = rule.behavior
        break
      }

      if (isResource(rule.resource, sanitizedResource) && isAbility(rule.ability, ability)) {
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
    resource: ResourceType<T>,
    guard: (params: any) => Promise<boolean>,
  ) => {
    this.rules = [...this.rules, { behavior: true, ability, resource, guard }]
  }

  cannot = (
    ability: AbilityType,
    resource: ResourceType<T>,
    guard: (params: any) => Promise<boolean>,
  ) => {
    this.rules = [...this.rules, { behavior: false, ability, resource, guard }]
  }
}

// Singleton
export const GuardInit = <T>(ability: IAbilities<T>) => new Guard(ability)
