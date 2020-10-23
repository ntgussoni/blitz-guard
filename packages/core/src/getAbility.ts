import { AbilityType, ResourceType, IGuard } from "@blitz-guard/core"
import { Ctx } from "blitz"

export type useCanCanInputType<T> = {
  abilities: [AbilityType, ResourceType<T>, {}?][]
}

export const getAbilityInit = <T>(GuardInstance: IGuard<T>) =>
  async function getAbility({ abilities }: useCanCanInputType<T>, ctx: Ctx) {
    const retorno = await Promise.all(
      abilities.map(
        async ([ability, resource, args = {}]) =>
          await GuardInstance.test(ctx, args, ability, resource),
      ),
    )
    return retorno
  }
