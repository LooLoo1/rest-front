import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputFile = path.join(__dirname, "components.ts");
const outputFile = path.join(__dirname, "generated-schema-types.ts");

const content = fs.readFileSync(inputFile, "utf-8");

const match = content.match(/schemas\s*:\s*{([\s\S]*?)}/);
if (!match) {
  console.error("Schemas block not found");
  process.exit(1);
}

const schemasBlock = match[1];

const schemaNames = Array.from(schemasBlock.matchAll(/(\w+)\s*:/g)).map(
  (m) => m[1]
);

const generated = schemaNames
  .map((name) => `export type ${name} = components["schemas"]["${name}"];`)
  .join("\n");

const finalOutput = `// 🔧 Auto-generated from components["schemas"]\n${generated}\n`;

fs.writeFileSync(outputFile, finalOutput, "utf-8");

console.log("✔ Generated schema types saved to:", outputFile);
