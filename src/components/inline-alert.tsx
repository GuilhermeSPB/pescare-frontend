import type { ReactNode } from 'react'

interface InlineAlertProps {
  title?: string
  message: string
  // Ação de recuperação opcional, ex.: botão "Tentar novamente".
  action?: ReactNode
}

// Erro dentro do fluxo da tela. O Message do Lara usa vermelho claro (#ff5757)
// que não passa no AA; aqui o texto fica em vermelho escuro sobre fundo suave.
export function InlineAlert({ title, message, action }: InlineAlertProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-md border border-danger-line bg-danger-soft px-4 py-3 text-danger sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <i className="pi pi-exclamation-circle mt-0.5" aria-hidden="true" />
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <p>{message}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
