import { Link } from 'react-router'

interface ModuleCardProps {
  label: string
  // Classe do primeicons, ex.: 'pi pi-wrench'.
  icon: string
  description?: string
  // Sem `to`, o módulo ainda não existe: o cartão aparece apagado, com "Em breve".
  to?: string
}

const CARD_BASE_CLASS = 'flex h-full flex-col rounded-md border border-line bg-white p-6'

export function ModuleCard({ label, icon, description, to }: ModuleCardProps) {
  const isAvailable = to !== undefined
  const content = (
    <>
      <i
        className={`${icon} text-3xl ${isAvailable ? 'text-primary' : 'text-gray-300'}`}
        aria-hidden="true"
      />
      <h2 className={`mt-4 text-lg font-semibold ${isAvailable ? 'text-ink' : 'text-ink-muted'}`}>
        {label}
      </h2>
      {description && <p className="mt-2 text-ink-muted">{description}</p>}
    </>
  )

  if (!isAvailable) {
    return (
      <div aria-disabled="true" className={CARD_BASE_CLASS}>
        {content}
        <p className="mt-auto pt-6 text-sm font-medium text-ink-soft">Em breve</p>
      </div>
    )
  }

  // O cartão inteiro é o link; o "Acessar página" fica sempre no pé, alinhado entre cartões.
  return (
    <Link
      to={to}
      className={`group ${CARD_BASE_CLASS} shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgb(15_23_42/0.2)]`}
    >
      {content}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary">
        Acessar página
        <i
          className="pi pi-arrow-right text-xs transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}
