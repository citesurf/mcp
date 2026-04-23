import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CitesurfClient } from "../client.js";
import type {
  ApiResponse,
  Brand,
  BrandCreateResult,
  BrandDetail,
  BrandUpdateResult,
} from "../types.js";
import { jsonText, errorText, encId } from "../utils.js";

export function registerBrandTools(server: McpServer, client: CitesurfClient) {
  server.registerTool(
    "list_brands",
    {
      description:
        "List all monitored brands with latest AI visibility metrics",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({}),
    },
    async () => {
      try {
        const result = await client.get<ApiResponse<Brand[]>>("/brands");
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "get_brand",
    {
      description:
        "Get detailed brand info: visibility score, platform breakdown, competitors, sentiment",
      annotations: { readOnlyHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID"),
      }),
    },
    async ({ brandId }) => {
      try {
        const result = await client.get<ApiResponse<BrandDetail>>(
          `/brands/${encId(brandId)}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "create_brand",
    {
      description:
        "Start monitoring a brand for AI visibility across ChatGPT, Claude, Gemini, Perplexity",
      inputSchema: z.object({
        name: z.string().describe("Brand name"),
        website: z
          .url()
          .describe("Brand website URL (e.g. https://example.com)"),
        language: z
          .enum(["en", "es", "de", "fr", "pt", "it", "nl", "pl"])
          .optional()
          .default("en")
          .describe("Language for prompts and analysis"),
      }),
    },
    async ({ name, website, language }) => {
      try {
        const result = await client.post<ApiResponse<BrandCreateResult>>(
          "/brands",
          { name, website, language }
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "delete_brand",
    {
      description: "Stop monitoring a brand and archive its data",
      annotations: { destructiveHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID to archive"),
      }),
    },
    async ({ brandId }) => {
      try {
        const result = await client.delete<ApiResponse<{ success: boolean }>>(
          `/brands/${encId(brandId)}`
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );

  server.registerTool(
    "update_brand",
    {
      description:
        "Update brand metadata: type, category, description, monitoring prompts, or competitors. All fields optional, only pass what you want to change. Passing competitors replaces the full list.",
      annotations: { idempotentHint: true },
      inputSchema: z.object({
        brandId: z.string().describe("The brand ID to update"),
        type: z
          .enum(["PERSON", "PRODUCT", "COMPANY", "SHOP"])
          .optional()
          .describe("Brand classification"),
        category: z
          .string()
          .max(100)
          .optional()
          .describe("Business category (e.g. 'AI Resume Builder')"),
        description: z
          .string()
          .max(500)
          .optional()
          .describe("Brand description (2 to 3 sentences)"),
        prompts: z
          .array(z.string().min(5).max(200))
          .length(3)
          .optional()
          .describe(
            "Exactly 3 search prompts to monitor. The first letter of each prompt is automatically capitalized on save."
          ),
        competitors: z
          .array(
            z.object({
              name: z.string().min(1).max(100).describe("Competitor name"),
              website: z
                .string()
                .optional()
                .describe("Competitor website (optional)"),
            })
          )
          .min(1)
          .max(5)
          .optional()
          .describe(
            "Between 1 and 5 competitors. Names must be unique (case-insensitive). Sending the array replaces the full list; empty arrays are rejected. Omit to leave competitors unchanged."
          ),
      }),
    },
    async ({ brandId, ...data }) => {
      try {
        const body = Object.fromEntries(
          Object.entries(data).filter(([, v]) => v !== undefined)
        );
        const result = await client.patch<ApiResponse<BrandUpdateResult>>(
          `/brands/${encId(brandId)}`,
          body
        );
        return jsonText(result.data);
      } catch (err) {
        return errorText(err);
      }
    }
  );
}
