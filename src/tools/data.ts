import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CitesurfClient } from "../client.js";
import type {
  AccountInfo,
  ApiResponse,
  InsightsResult,
  PersonaRecord,
  PersonasResult,
  PromptsResult,
  Report,
  ScanDetail,
  ScanListResult,
  SiteAudit,
  TrendsResult,
} from "../types.js";
import { jsonText, errorText, encId } from "../utils.js";

export function registerDataTools(server: McpServer, client: CitesurfClient) {
  server.registerTool(
    "list_scans",
    {
      description:
        "List scans for a brand with pagination (visibility score, mention rate, platform scores per scan)",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        offset: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Pagination offset"),
        pageSize: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .default(20)
          .describe("Results per page (max 100)"),
      }),
    },
    async ({ brandId, offset, pageSize }) => {
      try {
        const result = await client.get<ApiResponse<ScanListResult>>(
          `/brands/${encId(brandId)}/scans?offset=${offset}&pageSize=${pageSize}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_scan",
    {
      description:
        "Get full scan detail with probes, results per platform, citations, and site audit",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        scanId: z.string().describe("The scan ID"),
      }),
    },
    async ({ brandId, scanId }) => {
      try {
        const result = await client.get<ApiResponse<ScanDetail>>(
          `/brands/${encId(brandId)}/scans/${encId(scanId)}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_trends",
    {
      description:
        "Get historical scan trends for a brand (visibility score, mention rate, platform breakdown over time)",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        range: z
          .enum(["7", "30", "90"])
          .optional()
          .default("30")
          .describe("Days of history: 7, 30, or 90"),
      }),
    },
    async ({ brandId, range }) => {
      try {
        const result = await client.get<ApiResponse<TrendsResult>>(
          `/brands/${encId(brandId)}/trends?range=${range}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_prompts",
    {
      description:
        "Get AI platform probe results grouped by prompt (what each AI said about the brand)",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        platform: z
          .enum(["CHATGPT", "CLAUDE", "PERPLEXITY", "GEMINI"])
          .optional()
          .describe("Filter by platform"),
        offset: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Pagination offset"),
        pageSize: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .default(10)
          .describe("Results per page (max 100)"),
      }),
    },
    async ({ brandId, platform, offset, pageSize }) => {
      try {
        const params = new URLSearchParams();
        if (platform) params.set("platform", platform);
        params.set("offset", String(offset));
        params.set("pageSize", String(pageSize));
        const result = await client.get<ApiResponse<PromptsResult>>(
          `/brands/${encId(brandId)}/prompts?${params}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_personas",
    {
      description:
        "Get AI platform probe results grouped by persona (how different user types discover the brand)",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        offset: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Pagination offset"),
        pageSize: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .default(2)
          .describe("Results per page (max 50)"),
      }),
    },
    async ({ brandId, offset, pageSize }) => {
      try {
        const result = await client.get<ApiResponse<PersonasResult>>(
          `/brands/${encId(brandId)}/personas?offset=${offset}&pageSize=${pageSize}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "update_persona",
    {
      description:
        "Update the name or description of a persona. Every brand has exactly 3 personas; you can edit them but not add or remove.",
      annotations: { idempotentHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        personaId: z.string().describe("The persona ID"),
        name: z
          .string()
          .min(1)
          .max(80)
          .describe("Persona archetype name (1-80 chars)"),
        description: z
          .string()
          .min(1)
          .max(400)
          .describe("Persona description (1-400 chars, 30-60 words recommended)"),
      }),
    },
    async ({ brandId, personaId, name, description }) => {
      try {
        const result = await client.patch<
          ApiResponse<{ persona: PersonaRecord }>
        >(`/brands/${encId(brandId)}/personas/${encId(personaId)}`, {
          name,
          description,
        });
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_insights",
    {
      description:
        "Get AI generated recommendations for improving brand visibility, prioritized by impact",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        status: z
          .enum(["pending", "completed"])
          .optional()
          .describe("Filter by status"),
        offset: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Pagination offset"),
        pageSize: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .default(20)
          .describe("Results per page (max 50)"),
      }),
    },
    async ({ brandId, status, offset, pageSize }) => {
      try {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        params.set("offset", String(offset));
        params.set("pageSize", String(pageSize));
        const result = await client.get<ApiResponse<InsightsResult>>(
          `/brands/${encId(brandId)}/insights?${params}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "update_insight",
    {
      description:
        "Dismiss or complete an insight. Dismiss deletes it, complete validates improvement with before and after metrics.",
      annotations: { destructiveHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
        insightId: z.string().describe("The insight ID"),
        action: z
          .enum(["dismiss", "complete"])
          .describe(
            "Action: dismiss (delete) or complete (validate improvement)"
          ),
      }),
    },
    async ({ brandId, insightId, action }) => {
      try {
        const result = await client.patch<ApiResponse<unknown>>(
          `/brands/${encId(brandId)}/insights/${encId(insightId)}`,
          { action }
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_site_audit",
    {
      description:
        "Get technical audit results: robots.txt AI crawler access, llms.txt, schema.org, sitemap, Open Graph",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
      }),
    },
    async ({ brandId }) => {
      try {
        const result = await client.get<ApiResponse<SiteAudit | null>>(
          `/brands/${encId(brandId)}/site-audit`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_report",
    {
      description:
        "Get comprehensive AI visibility report: scores, platform performance, prompts, sentiment, competitors, cited domains, trends, site audit, and insights in one call",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
      }),
    },
    async ({ brandId }) => {
      try {
        const result = await client.get<ApiResponse<Report>>(
          `/brands/${encId(brandId)}/report`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_account",
    {
      description:
        "Get account info: plan, payment status, credit balance, brand count and limit",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({}),
    },
    async () => {
      try {
        const result = await client.get<ApiResponse<AccountInfo>>("/account");
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );
}
