// This import should be fixed??
const { BlitzGuardMiddleware } = require("@blitz-guard/core/dist/middleware.js")
const { sessionMiddleware, simpleRolesIsAuthorized } = require("@blitzjs/server")

module.exports = {
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
    BlitzGuardMiddleware({
      excluded: ["/api/auth/mutations/login"],
    }),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
