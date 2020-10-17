import { AbilityType, ResourceType } from "blitz-guard"
import { Ctx } from "blitz"
import Guard from "../index"

export type useCanCanInputType = {
  abilities: [AbilityType, ResourceType, {}?][]
}
export default async function getAbility({ abilities }: useCanCanInputType, ctx: Ctx) {
  return await Promise.all(
    abilities.map(
      async ([ability, resource, args = {}]) => await Guard.test(ctx, args, ability, resource)
    )
  )
}
