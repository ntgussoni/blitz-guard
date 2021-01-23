import { GuardInit, authorizeInit, useGuardInit, getAbilityInit } from "blitz-guard"
import db from "db"
import ability from "app/guard/ability"

const Guard = GuardInit<typeof db>(ability)
export const getAbility = getAbilityInit(Guard)
export const authorize = authorizeInit(Guard)
// eslint-disable-next-line react-hooks/rules-of-hooks
export const useGuard = useGuardInit(getAbility)
export default Guard
