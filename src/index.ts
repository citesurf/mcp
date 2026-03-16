#!/usr/bin/env node
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CitesurfClient } from "./client.js";
import { registerBrandTools } from "./tools/brands.js";
import { registerDataTools } from "./tools/data.js";
import { registerScanTools } from "./tools/scan.js";

const pkg = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../package.json"),
    "utf-8"
  )
) as { version: string };

const apiKey = process.env.CITESURF_API_KEY;
if (!apiKey) {
  process.stderr.write(
    "Error: CITESURF_API_KEY environment variable is required.\n" +
      "Get your API key at https://citesurf.com → Dashboard → Settings.\n"
  );
  process.exit(1);
}

const client = new CitesurfClient({
  apiKey,
  baseUrl: process.env.CITESURF_BASE_URL,
});

const server = new McpServer({
  name: "citesurf",
  version: pkg.version,
});

registerBrandTools(server, client);
registerDataTools(server, client);
registerScanTools(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(
    `Fatal: ${err instanceof Error ? err.message : String(err)}\n`
  );
  process.exit(1);
});
