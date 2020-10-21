import { AbilityType, ResourceType } from "blitz-guard"
import db from "db"
import { Ctx } from "blitz"
import Guard from "../index"

export type useCanCanInputType<T> = {
  abilities: [AbilityType, ResourceType<T>, {}?][]
}

export default async function getAbility({ abilities }: useCanCanInputType<typeof db>, ctx: Ctx) {
  return await Promise.all(
    abilities.map(
      async ([ability, resource, args = {}]) => await Guard.test(ctx, args, ability, resource),
    ),
  )
}
