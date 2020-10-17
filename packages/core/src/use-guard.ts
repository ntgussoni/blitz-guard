import { Ctx, useQuery } from "blitz"
import { AbilityType, ResourceType } from "@blitz-guard/core"

type AbilitiesType = [AbilityType, ResourceType, {}?][]
type GetAbilityType = (data: { abilities: AbilitiesType }, ctx: Ctx) => Promise<boolean[]>

export const useGuardInit = (getAbility: GetAbilityType) => (
  abilities: AbilitiesType,
): [boolean[], { isLoading: boolean }] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [result, { isLoading }] = useQuery(getAbility, { abilities })
  return [result, { isLoading }]
}
