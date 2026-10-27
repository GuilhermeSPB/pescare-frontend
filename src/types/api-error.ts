// Formato de erro de toda a API (`errorHandler` do backend).
export interface ApiErrorIssue {
  path: string
  message: string
}

export interface ApiErrorBody {
  message: string
  issues?: ApiErrorIssue[]
}
