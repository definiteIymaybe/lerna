import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from "@nrwl/devkit";
import * as path from "path";
import { E2eProjectGeneratorSchema } from "./schema";

interface NormalizedSchema extends E2eProjectGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: E2eProjectGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp("/", "g"), "-");
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags ? options.tags.split(",").map((s) => s.trim()) : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
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
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: "application",
    sourceRoot: `${normalizedOptions.projectRoot}`,
    targets: {
      e2e: {
        executor: "nx:run-commands",
        options: {
          commands: [
            {
              command: "npm run e2e-start-local-registry",
            },
            {
              command: "npm run e2e-build-package-publish",
            },
            {
              command: `nx run-e2e-tests ${normalizedOptions.projectName}`,
            },
          ],
          parallel: false,
        },
      },
      "run-e2e-tests": {
        executor: "@nrwl/jest:jest",
        options: {
          jestConfig: `${normalizedOptions.projectRoot}/jest.config.ts`,
          passWithNoTests: true,
          runInBand: true,
        },
        outputs: [`{workspaceRoot}/coverage/${normalizedOptions.projectRoot}`],
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
