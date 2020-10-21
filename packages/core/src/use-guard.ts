import { Ctx, useQuery } from "blitz"
import { AbilityType, ResourceType } from "@blitz-guard/core"

type AbilitiesType<T> = [AbilityType, ResourceType<T>, {}?][]
type GetAbilityType<T> = (data: { abilities: AbilitiesType<T> }, ctx: Ctx) => Promise<boolean[]>

export const useGuardInit = <T>(getAbility: GetAbilityType<T>) => (
  abilities: AbilitiesType<T>,
): [boolean[], { isLoading: boolean }] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [result, { isLoading }] = useQuery(getAbility, { abilities })
  return [result, { isLoading }]
}
