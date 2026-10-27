import { Button } from 'primereact/button'

import { InlineAlert } from '@/components/inline-alert'

interface QueryErrorAlertProps {
  title: string
  message: string
  isRetrying: boolean
  onRetry: () => void
}

// Falha ao carregar dados, com o caminho de volta na própria mensagem.
export function QueryErrorAlert({ title, message, isRetrying, onRetry }: QueryErrorAlertProps) {
  return (
    <InlineAlert
      title={title}
      message={message}
      action={
        <Button
          label="Tentar novamente"
          icon="pi pi-refresh"
          size="small"
          outlined
          loading={isRetrying}
          onClick={onRetry}
        />
      }
    />
  )
}
