import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const webDir = join(rootDir, "web");
const functionsDir = join(rootDir, "functions");

const copyDir = (source, destination) => {
  if (!existsSync(source)) {
    throw new Error(`Expected build artifact at ${source}, but it was not found.\nRun \"npm --prefix web run build\" before syncing.`);
  }
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true });
};

copyDir(join(webDir, ".next"), join(functionsDir, ".next"));
copyDir(join(webDir, "public"), join(functionsDir, "public"));

console.log("✓ Synced Next.js build output into functions/.next and functions/public");
