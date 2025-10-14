import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
  const files = glob.sync(resolve(__dirname, "**/*.test.ts"));

  if (files.length === 0) {
    return;
  }

  let failed = false;

  for (const file of files) {
    try {
      console.log(`\nRunning: ${file}`);
      await import(file); 
    } catch (err) {
      console.error(err);
      failed = true;
    }
  }

  if (failed) {
    console.error("\n Some tests failed.");
    process.exit(1);
  } else {
    console.log("\n✅ All tests passed!");
  }
}

runTests();
