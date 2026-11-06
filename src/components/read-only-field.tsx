interface ReadOnlyFieldProps {
  label: string
  value: string
}

// Dado que aparece num formulário mas não se edita (ex.: o e-mail em "Meu perfil"). Texto, não
// input desabilitado: o cinza do desabilitado do Lara fica abaixo do contraste AA.
// `overflow-wrap: anywhere` quebra só o que não cabe (um e-mail longo); listas quebram nos espaços.
export function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="font-medium text-ink">{label}</dt>
      <dd className="text-ink-muted [overflow-wrap:anywhere]">{value}</dd>
    </div>
  )
}
