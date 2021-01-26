import {
  AbilityType,
  CanType,
  IAbilities,
  IGuard,
  IGuardBuilder,
  ResourceType,
  _CannotType,
  _CanType,
  RuleType,
} from "./types"
import { Manage, All } from "./const"
import { authorizeInit } from "./authorize"
import { getAbilityInit } from "./getAbility"

const isAbility = <T>(ruleAbility: AbilityType<T>, ability: AbilityType<T>) =>
  ruleAbility === ability || ruleAbility === Manage.value

const isResource = <T>(ruleResource: ResourceType<T>, resource: ResourceType<T>) =>
  ruleResource === resource || ruleResource === All.value
export class Guard<T, R> implements IGuard<T, R> {
  private rules: RuleType<T, R>[]
  ability: IGuard<T, R>["ability"]

  constructor(ability: IAbilities<T, R>) {
    if (!ability) throw new Error("GUARD: Ability file not present")
    this.ability = ability
    this.rules = []
  }

  can: CanType<T, R> = async (ctx, args, ability, resource) => {
    const sanitizedResource = String(resource).toLowerCase() as ResourceType<T>

    if (!ctx) throw new Error("GUARD: ctx cannot be empty")
    if (!ability) throw new Error("GUARD: ability cannot be empty")
    if (!resource) throw new Error("GUARD: resource cannot be empty")

    try {
      await this.ability(ctx, {
        can: this._can,
        cannot: this._cannot,
      })
    } catch (e) {
      throw new Error(`GUARD: You should not throw errors in the ability file \n\r ${e}`)
    }

    let can = true
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i]

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

  getRules = () => this.rules

  _can: _CanType<T, R> = (ability, resource, guard) => {
    this.rules = [{ behavior: true, ability, resource, guard }, ...this.rules]
  }

  _cannot: _CannotType<T, R> = (ability, resource, guard) => {
    this.rules = [{ behavior: false, ability, resource, guard }, ...this.rules]
  }
}

export function GuardBuilder<T = any, R = any>(ability: IAbilities<T, R>): IGuardBuilder<T, R> {
  const instance = new Guard<T, R>(ability)
  const authorize = authorizeInit<T, R>(instance)
  const getAbility = getAbilityInit<T, R>(instance)
  return {
    instance,
    can: instance.can,
    authorize,
    getAbility,
  }
}
