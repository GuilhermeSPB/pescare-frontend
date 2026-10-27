interface ActiveStatusTagProps {
  isActive: boolean
}

const TAG_BASE_CLASS =
  'inline-flex items-center rounded-full border bg-white px-2.5 py-0.5 text-sm font-medium'

// Etiqueta em pílula só com contorno: mais leve que as severidades sólidas do Lara
// (verde #22c55e com texto branco, abaixo do AA). Inativo fica neutro, não vermelho:
// desativar não é erro, o registro só sai do app.
export function ActiveStatusTag({ isActive }: ActiveStatusTagProps) {
  if (isActive) {
    return <span className={`${TAG_BASE_CLASS} border-green-600 text-green-700`}>Ativo</span>
  }

  return <span className={`${TAG_BASE_CLASS} border-slate-400 text-slate-600`}>Inativo</span>
}
