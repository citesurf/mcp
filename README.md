# @citesurf/mcp

MCP server for [Citesurf](https://www.citesurf.com). AI visibility monitoring.

Check if ChatGPT, Claude, Perplexity, and Gemini recommend any brand. Get visibility scores, sentiment, competitor data, and actionable insights, all from your AI agent.

## Install

```bash
npx -y @citesurf/mcp
```

## Requirements

- A Citesurf account with an active Plus or Max subscription
- An API key (create one in Dashboard > Settings)
- Prepaid credits for scan operations

## Setup

Add to your MCP client config:

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "citesurf": {
      "command": "npx",
      "args": ["-y", "@citesurf/mcp"],
      "env": {
        "CITESURF_API_KEY": "cs_live_..."
      }
    }
  }
}
```

### Cursor

`.cursor/mcp.json` in your project or global settings

```json
{
  "mcpServers": {
    "citesurf": {
      "command": "npx",
      "args": ["-y", "@citesurf/mcp"],
      "env": {
        "CITESURF_API_KEY": "cs_live_..."
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add citesurf -e CITESURF_API_KEY=cs_live_... -- npx -y @citesurf/mcp
```

### Environment Variables

| Variable            | Required | Description                                    |
| ------------------- | -------- | ---------------------------------------------- |
| `CITESURF_API_KEY`  | Yes      | Your API key from Dashboard > Settings         |
| `CITESURF_BASE_URL` | No       | API base URL (default: `https://www.citesurf.com`) |

## Tools

### Brands

| Tool           | Description                                            | Credits |
| -------------- | ------------------------------------------------------ | ------- |
| `list_brands`  | List all monitored brands with latest metrics          | 0       |
| `get_brand`    | Get detailed brand info: score, platforms, competitors | 0       |
| `create_brand` | Start monitoring a brand across all 4 AI platforms     | 0       |
| `update_brand` | Update brand type, category, description, or prompts   | 0       |
| `delete_brand` | Stop monitoring and archive a brand                    | 0       |

### Data

| Tool             | Description                                    | Credits |
| ---------------- | ---------------------------------------------- | ------- |
| `list_scans`     | Paginated scan list for a brand                | 0       |
| `get_scan`       | Full scan detail with probes and citations     | 0       |
| `get_trends`     | Historical scan trends (7, 30, or 90 days)     | 0       |
| `get_prompts`    | AI platform probe results grouped by prompt    | 0       |
| `get_personas`   | Probe results grouped by persona               | 0       |
| `get_insights`   | AI generated recommendations for visibility    | 0       |
| `update_insight` | Dismiss or complete an insight                 | 0       |
| `get_site_audit` | Technical audit (robots.txt, llms.txt, schema) | 0       |
| `get_report`     | Comprehensive report with all data in one call | 0       |
| `get_account`    | Plan, credit balance, brand count              | 0       |

### Scans

| Tool           | Description                         | Credits |
| -------------- | ----------------------------------- | ------- |
| `trigger_scan` | Trigger new scan for existing brand | 1       |

Each scan costs 1 credit and runs across all 4 platforms (ChatGPT, Claude, Gemini, Perplexity). Reading data never costs credits. Purchase credit packs in the [Citesurf dashboard](https://www.citesurf.com).

## Example Usage

```text
> List my monitored brands
> What are the top insights for brand xyz?
> How has my visibility score changed over the last 30 days?
> Show me the latest scan detail for my brand
> What do different personas see when asking about my brand?
> Run a comprehensive report on my brand
> Update my brand's description and monitoring prompts
```

## License

MIT
