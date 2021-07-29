import {
  AbilityType,
  CanType,
  IAbilities,
  IGuard,
  IGuardBuilder,
  ResourceType,
  _CannotType,
  _CanType,
  IRule,
} from "./types"
import { Manage, All } from "./const"
import { authorizeInit } from "./authorizeInit"
import { getAbilityInit } from "./getAbility"
// import SuperJson from "superjson"
// import { GuardAuthorizationError } from "./GuardAuthorizationError"

const isAbility = <T>(ruleAbility: AbilityType<T>, ability: AbilityType<T>) =>
  ruleAbility === ability || ruleAbility === Manage.value

const isResource = <T>(ruleResource: ResourceType<T>, resource: ResourceType<T>) =>
  ruleResource === resource || ruleResource === All.value

class Rule<IResource, IAbility> implements IRule<IResource, IAbility> {
  public reasonText: string = ""

  constructor(
    public behavior: boolean,
    public ability: AbilityType<IAbility>,
    public resource: ResourceType<IResource>,
    public guard?: (args: any) => Promise<boolean>,
  ) {}

  reason = (reason: string) => (this.reasonText = reason)
}
export class Guard<T, R> implements IGuard<T, R> {
  private rules: IRule<T, R>[]
  ability: IGuard<T, R>["ability"]

  constructor(ability: IAbilities<T, R>) {
    if (!ability) throw new Error("GUARD: Ability file not present")
    this.ability = ability
    this.rules = []
  }

  can: CanType<T, R> = async (ability, resource, ctx, args) => {
    if (!ctx) throw new Error("GUARD: ctx cannot be empty")
    if (!ability) throw new Error("GUARD: ability cannot be empty")
    if (!resource) throw new Error("GUARD: resource cannot be empty")

    try {
      this.rules = []
      await this.ability(ctx, {
        can: this._can,
        cannot: this._cannot,
      })
    } catch (e) {
      throw new Error(`GUARD: You should not throw errors in the ability file \n\r ${e}`)
    }

    let can = true
    let reason = ""
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i]

      const matchAll = rule.resource === All.value && rule.ability === Manage.value

      if (matchAll) {
        can = rule.behavior
        reason = rule.reasonText
        break
      }

      if (isResource(rule.resource, resource) && isAbility(rule.ability, ability)) {
        if (rule.guard) {
          if (await rule.guard(args)) {
            can = rule.behavior
            reason = rule.reasonText
          } else {
            continue
          }
        } else {
          can = rule.behavior
          reason = rule.reasonText
        }

        break
      }
    }
    return { can, reason }
  }

  getPreviouslyRanRules = () => this.rules

  _can: _CanType<T, R> = (ability, resource, guard) => {
    const newRule = new Rule<T, R>(true, ability, resource, guard)
    this.rules = [newRule, ...this.rules]
    return newRule
  }

  _cannot: _CannotType<T, R> = (ability, resource, guard) => {
    const newRule = new Rule<T, R>(false, ability, resource, guard)
    this.rules = [newRule, ...this.rules]
    return newRule
  }
}

export function GuardBuilder<T = any, R = any>(ability: IAbilities<T, R>): IGuardBuilder<T, R> {
  const instance = new Guard<T, R>(ability)
  const { authorize, authorizePipe } = authorizeInit<T, R>(instance)
  const getAbility = getAbilityInit<T, R>(instance)

  // SuperJson.registerClass(GuardAuthorizationError)
  // SuperJson.allowErrorProps("rule")

  return {
    instance,
    can: instance.can,
    authorizePipe,
    authorize,
    getAbility,
  }
}
