import { IGuard, IGetAbility } from "./types"

export function getAbilityInit<T, R>(GuardInstance: IGuard<T, R>): IGetAbility<T, R> {
  return async function getAbility(rules, ctx) {
    const resultsPromise = rules.map(([ability, resource, args = {}]) =>
      GuardInstance.can(ability, resource, ctx, args),
    )
    return await Promise.all(resultsPromise)
  }
}
