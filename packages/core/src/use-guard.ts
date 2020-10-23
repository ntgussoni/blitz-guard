/* eslint-disable react-hooks/rules-of-hooks */
import { Ctx, useQuery } from "blitz"
import { AbilityType, ResourceType } from "@blitz-guard/core"

// TODO: rename this
type AbilitiesType<T> = [AbilityType, ResourceType<T>, {}?][]
type GetAbilityType<T> = (data: { abilities: AbilitiesType<T> }, ctx: Ctx) => Promise<boolean[]>

export const useGuardInit = <T>(getAbility: GetAbilityType<T>) => (
  abilities: AbilitiesType<T>,
): [boolean[], { isLoading: boolean }] => {
  const [result, { isLoading }] = useQuery(getAbility, { abilities })
  return [result, { isLoading }]
}
