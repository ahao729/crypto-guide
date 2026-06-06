const BASE_URL = ""

interface ApiError {
  error: string
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const res = await fetch(url, config)

    if (!res.ok) {
      let errorMsg = `请求失败 (${res.status})`
      try {
        const errorData: ApiError = await res.json()
        if (errorData.error) {
          errorMsg = errorData.error
        }
      } catch {
        // ignore parse error
      }
      throw new Error(errorMsg)
    }

    // Handle 204 No Content
    if (res.status === 204) {
      return undefined as T
    }

    // Handle empty response
    const text = await res.text()
    if (!text) {
      return undefined as T
    }

    return JSON.parse(text) as T
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T = void>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
