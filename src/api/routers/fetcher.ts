import { ApiError, API_ERROR } from 'api/errors'

const API_HOST = process.env.API_HOST || ''


export async function fetcher(
  input: RequestInfo,
  {
    method,
    data
  }: {
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    data?: string | object | null
  } = {method: "GET", data: null}
) {
  const url = API_HOST + input
  if (data && typeof data === "object") {
    data = JSON.stringify(data)
  }
  const response = await fetch(url, {
    headers: {
      'Content-type': 'application/json',
    },
    method: method,
    body: data
  })

  if (response.ok) {
    if (method === "DELETE") {
      return true
    }
    return await response.json()
  } else {
    switch (response.status) {
      case 500:
        throw new Error("Http 500: Internal Server Error")
      case 401:
        throw new Error("Http 401: Session Expired")
      case 422:
        const err = await response.json()
        // TODO: Handle API error codes here
        if ([API_ERROR.UNIQUE_OR_REQUIRED_FIELD, API_ERROR.INSUFFICIENT_QUANTITY].includes(err['error_code'])) {
          throw new ApiError(response.status, err['message'], err['error_code'])
        }
        throw new Error("Http 422: Unprocessable Entity")
      default:
        throw new Error("Network Error")
    }
  }
} 