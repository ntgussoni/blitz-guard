import { RecipeBuilder } from "@blitzjs/installer"
import { join } from "path"

export default RecipeBuilder()
  .setName("🛡️  Blitz Guard")
  .setDescription(
    `This recipe will install all necessary dependencies and configure Blitz Guard for immediate use.`,
  )
  .setOwner("ntorres.dev@gmail.com")
  .setRepoLink("https://github.com/ntgussoni/blitz-guard")
  .addAddDependenciesStep({
    stepId: "addDeps",
    stepName: "Add npm dependencies",
    explanation: `Adding Blitz Guard dependencies`,
    packages: [{ name: "blitz-guard", version: "latest" }],
  })
  .addNewFilesStep({
    stepId: "addApiRoute",
    stepName: "Add Api Route ",
    explanation: `In order to use the useGuard react hook, we need to create an API endpoint.`,
    targetDirectory: "app/guard/queries/getAbility.ts",
    templatePath: join(__dirname, "templates", "queries", "getAbility.ts"),
    templateValues: {},
  })
  .addNewFilesStep({
    stepId: "addAbilityFile",
    stepName: "Add Ability Route ",
    explanation: `All your rules must reside in the ability.ts file. Creating that for you now.`,
    targetDirectory: "app/guard/ability.ts",
    templatePath: join(__dirname, "templates", "ability.ts"),
    templateValues: {},
  })
  .addNewFilesStep({
    stepId: "addGuardMainFile",
    stepName: "Add Guard main file ",
    explanation: `We'll add a basic guard configuration file that will serve as entrypoint`,
    targetDirectory: "app/guard/index.ts",
    templatePath: join(__dirname, "templates", "index.ts"),
    templateValues: {},
  })
  .build()
