import { execSync } from "child_process";
import { remove } from "fs-extra";
import { existsSync } from "fs";
import { stripIndent, NX_PREFIX } from "nx/src/utils/logger";

const MESSAGE = `
Did you know that you can run the command with:
  > NX_E2E_SKIP_BUILD_CLEANUP - saves time by reusing the previously built local packages
  > CI - simulate the CI environment settings

If your e2e tests fail when trying to create a workspace, remove your npx cache.
\n`;

const DIRECTORIES_TO_REMOVE = [
  "./dist",
  "/tmp/lerna-e2e",
  "./tmp/local-registry",
];

// ============================= JH: extracted the above customization points to constants

process.env.npm_config_registry = `http://localhost:4872`;
process.env.YARN_REGISTRY = process.env.npm_config_registry;

async function buildPackagePublishAndCleanPorts() {
  if (!process.env.NX_E2E_SKIP_BUILD_CLEANUP) {
    if (!process.env.CI) {
      console.log(stripIndent(MESSAGE));
    }
    await Promise.all(DIRECTORIES_TO_REMOVE.map((dir) => remove(dir)));
  }
  // JH: changed from ./build to ./dist
  if (!process.env.NX_E2E_SKIP_BUILD_CLEANUP || !existsSync("./dist")) {
    try {
      await updateVersionsAndPublishPackages();
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  } else {
    console.log(`\n⏩ Project building skipped. Reusing the existing packages`);
  }
}

async function updateVersionsAndPublishPackages() {
  console.log(`\n${NX_PREFIX} 📦 Publishing packages\n`);
  const isVerbose = process.env.NX_VERBOSE_LOGGING === "true" || process.argv.includes("--verbose");
  // JH: changed version to fixed 999.9.9-e2e.0
  // TODO: discuss with Jason why "major" was chosen here
  const response = execSync(`yarn nx-release 999.9.9-e2e.0 --local`, {
    stdio: isVerbose ? "inherit" : "pipe",
    encoding: "utf8",
  });
  // extract published version
  if (!isVerbose) {
    const value = response.match(/Successfully published:\s+ - .+@(.*)/);
    console.log(`${NX_PREFIX} ✅ Published local version: ${value?.[1]}\n`);
  }
}

(async () => {
  await buildPackagePublishAndCleanPorts();
})();
