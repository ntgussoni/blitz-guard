import { Ctx } from "blitz"
import db from "db"
import { GuardBuilder } from "@blitz-guard/core"
import { PrismaModelsType } from "@blitz-guard/core/src/types"

type ExtendedResourceTypes = PrismaModelsType<typeof db> | "Dog"
type ExtendedAbilityTypes = "eat all the food" | "walk" | "jump"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx: Ctx, { can, cannot }) => {
    /*
		Your rules go here
		can("jump", "dog", (args) => { ... })
    cannot("eat all the food", "dog", (args) => { ... })
    */
  }
)

export default Guard
