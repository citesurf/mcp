import { CitesurfApiError } from "./client.js";

export function jsonText(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function errorText(err: unknown) {
  if (err instanceof CitesurfApiError) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error ${err.status} (${err.code}): ${err.message}`,
        },
      ],
      isError: true as const,
    };
  }
  return {
    content: [
      {
        type: "text" as const,
        text: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      },
    ],
    isError: true as const,
  };
}

/** URL-safe path segment encoding */
export function encId(id: string): string {
  return encodeURIComponent(id);
}
