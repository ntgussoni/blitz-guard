import { GuardInit, authorizeInit, useGuardInit } from "blitz-guard"
import db from "db"
import ability from "app/guard/ability"
import getAbilityInit from "app/guard/queries/getAbility"

const Guard = GuardInit<typeof db>(ability)
export const getAbility = getAbilityInit(Guard)
export const authorize = authorizeInit(Guard)
// eslint-disable-next-line react-hooks/rules-of-hooks
export const useGuard = useGuardInit(getAbility)
export default Guard
