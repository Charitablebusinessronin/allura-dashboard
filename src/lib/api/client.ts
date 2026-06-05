const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: { silentStatuses?: number[] }
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("allura_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.debug(`[API] ${method} ${path}`, body ? JSON.stringify(body).slice(0, 500) : "(no body)");

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    if (options?.silentStatuses?.includes(response.status)) {
      console.debug(`[API] ${method} ${path} → ${response.status} (silenced)`, errorBody);
    } else {
      console.error(`[API] ${method} ${path} → ${response.status}`, errorBody);
    }

    const message =
      errorBody && typeof errorBody === "object" && "error" in errorBody
        ? String((errorBody as { error?: string }).error)
        : `HTTP ${response.status}`;

    const code =
      errorBody && typeof errorBody === "object" && "code" in errorBody
        ? String((errorBody as { code?: string }).code)
        : `HTTP_${response.status}`;

    throw new ApiError(response.status, code, message, errorBody);
  }

  const contentType = response.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    return undefined as T;
  }

  const json = await response.json();
  if (json && typeof json === "object" && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

export const api = {
  get: <T>(path: string, options?: { silentStatuses?: number[] }) =>
    apiRequest<T>("GET", path, undefined, options),
  post: <T>(path: string, body: unknown) => apiRequest<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => apiRequest<T>("PUT", path, body),
  patch: <T>(path: string, body: unknown) => apiRequest<T>("PATCH", path, body),
  delete: <T>(path: string) => apiRequest<T>("DELETE", path),
};
