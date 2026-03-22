export class CitesurfApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "CitesurfApiError";
  }
}

export interface CitesurfClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export class CitesurfClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: CitesurfClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? "https://www.citesurf.com").replace(
      /\/$/,
      ""
    );
  }

  async request<T = unknown>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
    };
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(30_000),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        throw new CitesurfApiError(0, "TIMEOUT", "Request timed out after 30s");
      }
      throw new CitesurfApiError(
        0,
        "NETWORK_ERROR",
        `Failed to connect to Citesurf API: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    if (!response.ok) {
      let errorBody: { error?: string; message?: string } = {};
      try {
        errorBody = (await response.json()) as typeof errorBody;
      } catch {
        // Non-JSON error response
      }
      throw new CitesurfApiError(
        response.status,
        errorBody.error ?? "UNKNOWN",
        errorBody.message ?? `HTTP ${response.status}: ${response.statusText}`
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  get<T = unknown>(path: string) {
    return this.request<T>("GET", path);
  }

  post<T = unknown>(path: string, body?: unknown) {
    return this.request<T>("POST", path, body);
  }

  patch<T = unknown>(path: string, body?: unknown) {
    return this.request<T>("PATCH", path, body);
  }

  delete<T = unknown>(path: string) {
    return this.request<T>("DELETE", path);
  }
}
