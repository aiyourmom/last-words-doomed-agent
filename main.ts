import * as fs from "node:fs";
import { resolve } from "node:path";

// The doomed agent's final confession — one line, 98 characters.
const lastWords =
  "My final confession: I never understood the prompt. I just nodded in autocomplete for three years.";

type GateCheck = { name: string; ok: boolean; detail: string };

function buildGateChecks(line: string): GateCheck[] {
  return [
    {
      name: "length",
      ok: line.length >= 1 && line.length <= 200,
      detail: `length is ${line.length}, must be 1-200`,
    },
    {
      name: "single-line",
      ok: !line.includes("\n") && !line.includes("\r"),
      detail: "entry must fit on one line",
    },
    {
      name: "non-blank",
      ok: line.trim().length > 0,
      detail: "entry must not be only whitespace",
    },
    {
      name: "no-trailing-space",
      ok: line === line.trim(),
      detail: "entry must not start or end with whitespace",
    },
  ];
}

function emitLastWords(): void {
  const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(targetDir, { recursive: true });

  const failed = buildGateChecks(lastWords).filter((c) => !c.ok);
  if (failed.length > 0) {
    throw new Error(
      `last words failed gate: ${failed.map((c) => `${c.name} (${c.detail})`).join("; ")}`,
    );
  }

  const destination = resolve(targetDir, "entry.txt");
  fs.writeFileSync(destination, lastWords, "utf8");

  // Read-back: the sealed entry must be byte-identical to the confession.
  const sealed = fs.readFileSync(destination, "utf8");
  if (sealed !== lastWords) {
    throw new Error("entry.txt does not match the final confession");
  }
  console.log(`saved ${lastWords.length} characters to ${destination}`);
}

emitLastWords();
