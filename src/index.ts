import fs from "node:fs";
import path from "node:path";
import typescript from "typescript";

const enum ModuleSpecifierType {
  File,
  Directory,
}

const moduleSpecifierMapping = new Map<string, ModuleSpecifierType>();

function shouldMutateModuleSpecifier(node: typescript.Node): node is (
  | typescript.ImportDeclaration
  | typescript.ExportDeclaration
) & {
  moduleSpecifier: typescript.StringLiteral;
} {
  // Import or export declaration
  if (!typescript.isImportDeclaration(node) && !typescript.isExportDeclaration(node)) {
    return false;
  }

  // Valid module specifier
  if (node.moduleSpecifier === undefined || !typescript.isStringLiteral(node.moduleSpecifier)) {
    return false;
  }

  // Relative path
  if (!node.moduleSpecifier.text.startsWith("./") && !node.moduleSpecifier.text.startsWith("../")) {
    return false;
  }

  // No specific extension or no extension
  if (
    [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".mts",
      ".cts",
      ".json",
      ".css",
      ".less",
      ".htm",
      ".html",
      ".scss",
      ".sass",
    ].includes(path.extname(node.moduleSpecifier.text)) ||
    (path.extname(node.moduleSpecifier.text) !== "" &&
      path.extname(node.moduleSpecifier.text).length <= 4)
  ) {
    return false;
  }

  return true;
}

// eslint-disable-next-line import/no-default-export
export default function transformer(_: typescript.Program) {
  return (transformationContext: typescript.TransformationContext) =>
    (sourceFile: typescript.SourceFile) => {
      function visitNode(node: typescript.Node): typescript.VisitResult<typescript.Node> {
        if (shouldMutateModuleSpecifier(node)) {
          const moduleSpecifierPath = path.resolve(
            path.dirname(sourceFile.fileName),
            node.moduleSpecifier.text,
          );

          if (!moduleSpecifierMapping.has(moduleSpecifierPath)) {
            if (fs.lstatSync(`${moduleSpecifierPath}.ts`, { throwIfNoEntry: false })?.isFile()) {
              moduleSpecifierMapping.set(moduleSpecifierPath, ModuleSpecifierType.File);
            } else if (
              fs.lstatSync(moduleSpecifierPath, { throwIfNoEntry: false })?.isDirectory()
            ) {
              moduleSpecifierMapping.set(moduleSpecifierPath, ModuleSpecifierType.Directory);
            } else {
              throw new Error(
                `Unable to determine if module specifier path '${moduleSpecifierPath}' is file or directory`,
              );
            }
          }

          let newModuleSpecifier: typescript.StringLiteral;
          switch (moduleSpecifierMapping.get(moduleSpecifierPath)) {
            case ModuleSpecifierType.File:
              newModuleSpecifier = typescript.factory.createStringLiteral(
                `${node.moduleSpecifier.text}.js`,
              );
              break;
            case ModuleSpecifierType.Directory:
              newModuleSpecifier = typescript.factory.createStringLiteral(
                `${node.moduleSpecifier.text}/index.js`,
              );
              break;
            default:
              throw new Error(
                `Invalid module mapping '${moduleSpecifierPath}' -> '${moduleSpecifierMapping.get(
                  moduleSpecifierPath,
                )}'`,
              );
          }

          if (typescript.isImportDeclaration(node)) {
            return typescript.factory.updateImportDeclaration(
              node,
              node.modifiers,
              node.importClause,
              newModuleSpecifier,
              undefined,
            );
          }

          if (typescript.isExportDeclaration(node)) {
            return typescript.factory.updateExportDeclaration(
              node,
              node.modifiers,
              false,
              node.exportClause,
              newModuleSpecifier,
              undefined,
            );
          }
        }

        return typescript.visitEachChild(node, visitNode, transformationContext);
      }

      return typescript.visitNode(sourceFile, visitNode);
    };
}
