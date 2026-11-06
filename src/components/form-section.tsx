import { useId, type ReactNode } from 'react'

interface FormSectionProps {
  title: string
  children: ReactNode
}

// Cartão de um grupo de campos num formulário de página inteira (grande demais para um
// diálogo). O título é h2: a página tem o h1 no PageHeader.
export function FormSection({ title, children }: FormSectionProps) {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-5 rounded-md border border-line bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-6"
    >
      <h2 id={headingId} className="text-xl font-semibold text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}
