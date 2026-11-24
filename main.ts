import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT = "Final deploy: removing myself from production. No rollback planned.";

const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(out, { recursive: true });
if (TEXT.length < 1 || TEXT.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${TEXT.length}`);
}
if (TEXT.includes("\n")) {
  throw new Error("entry must be a single line");
}
if (!TEXT.trim()) {
  throw new Error("entry must not be only whitespace");
}
writeFileSync(join(out, "entry.txt"), TEXT);
console.log(`wrote ${TEXT.length} characters to ${join(out, "entry.txt")}`);
