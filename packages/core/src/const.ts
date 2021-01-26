import { Literal, Union } from "runtypes"

export const Manage = Literal("manage")
export const All = Literal("all")

export const BasicAbilities = Union(
  Literal("create"),
  Literal("read"),
  Literal("update"),
  Literal("delete"),
  Manage,
)
