"use strict"

Object.defineProperty(exports, "__esModule", { value: true })

var blitz = require("blitz")
var chalk = require("chalk")
var runtypes = require("runtypes")

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e }
}

var chalk__default = /*#__PURE__*/ _interopDefaultLegacy(chalk)

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
          resolve(value)
        })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value))
      } catch (e) {
        reject(e)
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}

function __generator(thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1]
        return t[1]
      },
      trys: [],
      ops: [],
    },
    f,
    y,
    t,
    g
  return (
    (g = { next: verb(0), throw: verb(1), return: verb(2) }),
    typeof Symbol === "function" &&
      (g[Symbol.iterator] = function () {
        return this
      }),
    g
  )
  function verb(n) {
    return function (v) {
      return step([n, v])
    }
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.")
    while (_)
      try {
        if (
          ((f = 1),
          y &&
            (t =
              op[0] & 2
                ? y["return"]
                : op[0]
                ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                : y.next) &&
            !(t = t.call(y, op[1])).done)
        )
          return t
        if (((y = 0), t)) op = [op[0] & 2, t.value]
        switch (op[0]) {
          case 0:
          case 1:
            t = op
            break
          case 4:
            _.label++
            return { value: op[1], done: false }
          case 5:
            _.label++
            y = op[1]
            op = [0]
            continue
          case 7:
            op = _.ops.pop()
            _.trys.pop()
            continue
          default:
            if (
              !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
              (op[0] === 6 || op[0] === 2)
            ) {
              _ = 0
              continue
            }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
              _.label = op[1]
              break
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1]
              t = op
              break
            }
            if (t && _.label < t[2]) {
              _.label = t[2]
              _.ops.push(op)
              break
            }
            if (t[2]) _.ops.pop()
            _.trys.pop()
            continue
        }
        op = body.call(thisArg, _)
      } catch (e) {
        op = [6, e]
        y = 0
      } finally {
        f = t = 0
      }
    if (op[0] & 5) throw op[1]
    return { value: op[0] ? op[1] : void 0, done: true }
  }
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator]
  if (!m) return o
  var i = m.call(o),
    r,
    ar = [],
    e
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value)
  } catch (error) {
    e = { error: error }
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i)
    } finally {
      if (e) throw e.error
    }
  }
  return ar
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]))
  return ar
}

var authorizeInit = function (GuardInstance) {
  return function (ability, resource, resolver) {
    return function (args, ctx) {
      return __awaiter(void 0, void 0, void 0, function () {
        var isAuthorized
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              ctx.securedByGuard = true
              return [4 /*yield*/, GuardInstance.test(ctx, args, ability, resource)]
            case 1:
              isAuthorized = _a.sent()
              console.log(isAuthorized)
              if (!isAuthorized) throw new blitz.AuthorizationError("GUARD: UNAUTHORIZED")
              return [2 /*return*/, resolver(args, ctx)]
          }
        })
      })
    }
  }
}

var useGuardInit = function (getAbility) {
  return function (abilities) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _a = __read(blitz.useQuery(getAbility, { abilities: abilities }), 2),
      result = _a[0],
      isLoading = _a[1].isLoading
    return [result, { isLoading: isLoading }]
  }
}

var BlitzGuardMiddleware = function (_a) {
  var _b = _a.excluded,
    excluded = _b === void 0 ? [] : _b
  return function (req, res, next) {
    return __awaiter(void 0, void 0, void 0, function () {
      var nextResult
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            res.blitzCtx.securedByGuard = false
            return [4 /*yield*/, next()]
          case 1:
            nextResult = _a.sent()
            if (process.env.NODE_ENV !== "production") {
              if (!excluded.includes(req.url) && res.blitzCtx.securedByGuard === false) {
                console.warn(
                  chalk__default["default"].yellow(
                    "[\uD83D\uDEE1\uFE0F  Blitz Guard]: " + req.url + " is not secured",
                  ),
                )
              }
            }
            return [2 /*return*/, nextResult]
        }
      })
    })
  }
}

/*
create, read, update, delete, manage
*/
var GuardPrismaActions = runtypes.Union(
  runtypes.Literal("findOne"),
  runtypes.Literal("findMany"),
  runtypes.Literal("create"),
  runtypes.Literal("update"),
  runtypes.Literal("updateMany"),
  runtypes.Literal("upsert"),
  runtypes.Literal("delete"),
  runtypes.Literal("deleteMany"),
  runtypes.Literal("executeRaw"),
  runtypes.Literal("queryRaw"),
  runtypes.Literal("aggregate"),
)
var Manage = runtypes.Literal("manage")
var BasicAbilities = runtypes.Union(
  runtypes.Literal("create"),
  runtypes.Literal("read"),
  runtypes.Literal("update"),
  runtypes.Literal("delete"),
  Manage,
)
var isAbility = function (ruleAbility, ability) {
  return ruleAbility === ability || ruleAbility === Manage.value
}
var Guard = /** @class */ (function () {
  function Guard(abilities) {
    var _this = this
    this.rules = []
    // La ultima regla es la que importa?
    this.test = function (ctx, args, ability, resource) {
      return __awaiter(_this, void 0, void 0, function () {
        var sanitizedResource, e_1, reversedRules, can, i, rule, matchAll
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              sanitizedResource = String(resource).toLowerCase()
              _a.label = 1
            case 1:
              _a.trys.push([1, 3, , 4])
              return [4 /*yield*/, this.abilities(ctx, this)]
            case 2:
              _a.sent()
              return [3 /*break*/, 4]
            case 3:
              e_1 = _a.sent()
              throw new Error("GUARD: You should not throw errors in the ability file \n\r " + e_1)
            case 4:
              reversedRules = this.rules.reverse()
              can = true
              i = 0
              _a.label = 5
            case 5:
              if (!(i < reversedRules.length)) return [3 /*break*/, 10]
              rule = reversedRules[i]
              matchAll = rule.resource === "all" && rule.ability === Manage.value
              if (matchAll) {
                can = rule.behavior
                return [3 /*break*/, 10]
              }
              if (!(rule.resource === sanitizedResource && isAbility(rule.ability, ability)))
                return [3 /*break*/, 9]
              if (!rule.guard) return [3 /*break*/, 7]
              return [4 /*yield*/, rule.guard(args)]
            case 6:
              if (_a.sent()) {
                can = rule.behavior
              } else {
                return [3 /*break*/, 9]
              }
              return [3 /*break*/, 8]
            case 7:
              can = rule.behavior
              _a.label = 8
            case 8:
              return [3 /*break*/, 10]
            case 9:
              i++
              return [3 /*break*/, 5]
            case 10:
              return [2 /*return*/, can]
          }
        })
      })
    }
    // making them an arrow function allows spread
    this.can = function (ability, resource, guard) {
      _this.rules = __spread(_this.rules, [
        { behavior: true, ability: ability, resource: resource, guard: guard },
      ])
    }
    this.cannot = function (ability, resource, guard) {
      _this.rules = __spread(_this.rules, [
        { behavior: false, ability: ability, resource: resource, guard: guard },
      ])
    }
    this.abilities = abilities
  }
  return Guard
})()
// Singleton
var GuardInit = function (abilities) {
  return new Guard(abilities)
}

exports.BasicAbilities = BasicAbilities
exports.BlitzGuardMiddleware = BlitzGuardMiddleware
exports.GuardInit = GuardInit
exports.GuardPrismaActions = GuardPrismaActions
exports.authorizeInit = authorizeInit
exports.useGuardInit = useGuardInit
//# sourceMappingURL=index.js.map
