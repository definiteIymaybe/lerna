import { formatFiles, generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree } from "@nrwl/devkit";
import { addPropertyToJestConfig } from "@nrwl/jest/src/utils/config/update-config";
import libraryGenerator from "@nrwl/js/src/generators/library/library";
import * as path from "path";
import { E2eProjectGeneratorSchema } from "./schema";

interface NormalizedSchema extends E2eProjectGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(tree: Tree, options: E2eProjectGeneratorSchema): NormalizedSchema {
  const e2eRoot = "e2ee";
  const projectDirectory = options.directory ? `${e2eRoot}/${names(options.directory).fileName}` : e2eRoot;
  const projectName = names(options.name).fileName;
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}/${projectName}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: "",
  };
  generateFiles(tree, path.join(__dirname, "files"), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: E2eProjectGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  await libraryGenerator(tree, {
    name: normalizedOptions.name,
    directory: normalizedOptions.projectDirectory,
    skipTsConfig: true,
  });

  tree.delete(`${normalizedOptions.projectRoot}/README.md`);

  tree.children(`${normalizedOptions.projectRoot}/src/lib`).forEach((file) => {
    tree.delete(`${normalizedOptions.projectRoot}/src/lib/${file}`);
  });

  addPropertyToJestConfig(tree, `${normalizedOptions.projectRoot}/jest.config.ts`, "maxWorkers", 1, {
    valueAsString: false,
  });

  // addProjectConfiguration(tree, normalizedOptions.projectName, {
  //   root: normalizedOptions.projectRoot,
  //   projectType: "application",
  //   sourceRoot: `${normalizedOptions.projectRoot}`,
  //   targets: {
  //     e2e: {
  //       executor: "nx:run-commands",
  //       options: {
  //         commands: [
  //           {
  //             command: "npm run e2e-start-local-registry",
  //           },
  //           {
  //             command: "npm run e2e-build-package-publish",
  //           },
  //           {
  //             command: `nx run-e2e-tests ${normalizedOptions.projectName}`,
  //           },
  //         ],
  //         parallel: false,
  //       },
  //     },
  //     "run-e2e-tests": {
  //       executor: "@nrwl/jest:jest",
  //       options: {
  //         jestConfig: `${normalizedOptions.projectRoot}/jest.config.ts`,
  //         passWithNoTests: true,
  //         runInBand: true,
  //       },
  //       outputs: [`{workspaceRoot}/coverage/${normalizedOptions.projectRoot}`],
  //     },
  //   },
  // });
  // addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
