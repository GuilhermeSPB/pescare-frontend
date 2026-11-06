// positive: em uso (ativo, vigente). neutral: fora de uso (inativo, encerrado), sem alarme.
// pending: ainda não vale e espera alguém (rascunho). info: vai valer numa data (agendado).
export type StatusTone = 'positive' | 'neutral' | 'pending' | 'info'

interface StatusTagProps {
  tone: StatusTone
  label: string
}

const TAG_BASE_CLASS =
  'inline-flex items-center rounded-full border bg-white px-2.5 py-0.5 text-sm font-medium'

// Texto sobre branco passa no AA (verde 5,0:1, slate 7,6:1, âmbar 5,0:1, azul 6,7:1).
const TONE_CLASSES: Record<StatusTone, string> = {
  positive: 'border-green-600 text-green-700',
  neutral: 'border-slate-400 text-slate-600',
  pending: 'border-amber-600 text-amber-700',
  info: 'border-primary text-primary-ink',
}

// Etiqueta em pílula só com contorno: mais leve que as severidades sólidas do Lara
// (verde #22c55e com texto branco, abaixo do AA). Fora de uso fica neutro, não vermelho:
// desativar não é erro, o registro só sai do app.
export function StatusTag({ tone, label }: StatusTagProps) {
  return <span className={`${TAG_BASE_CLASS} ${TONE_CLASSES[tone]}`}>{label}</span>
}
