import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const functionsDir = join(rootDir, "functions");

const copyRequired = (source, destination) => {
  if (!existsSync(source)) {
    throw new Error(
      `Expected build artifact at ${source}, but it was not found.\nRun \"next build\" before syncing.`
    );
  }
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true });
};

const copyOptional = (source, destination) => {
  rmSync(destination, { recursive: true, force: true });
  if (!existsSync(source)) {
    mkdirSync(destination, { recursive: true });
    writeFileSync(join(destination, ".gitkeep"), "");
    return;
  }
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true });
};

copyRequired(join(rootDir, ".next"), join(functionsDir, ".next"));
copyOptional(join(rootDir, "public"), join(functionsDir, "public"));

console.log("✓ Synced Next.js build output into functions/.next and functions/public");
