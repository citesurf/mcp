import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CitesurfClient } from "../client.js";
import type { ApiResponse, ScanTriggerResult } from "../types.js";
import { jsonText, errorText, encId } from "../utils.js";

export function registerScanTools(server: McpServer, client: CitesurfClient) {
  server.registerTool(
    "trigger_scan",
    {
      description:
        "Trigger a new scan for an existing monitored brand (costs 1 credit, covers all 4 AI platforms). Returns credits used and remaining balance.",
      annotations: { idempotentHint: false },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
      }),
    },
    async ({ brandId }) => {
      try {
        const result = await client.post<ApiResponse<ScanTriggerResult>>(
          `/brands/${encId(brandId)}/scan`,
          {}
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );
}
