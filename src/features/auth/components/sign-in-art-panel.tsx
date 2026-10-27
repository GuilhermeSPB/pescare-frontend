import fishingIllustrationUrl from '@/assets/fishing-illustration.png'

// Ondas decorativas no pé do painel, em branco translúcido sobre o azul.
function PanelWaves() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-40 w-full"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 70q150-50 300 0t300 0t300 0t300 0V200H0z" fill="rgb(255 255 255 / 0.06)" />
      <path d="M0 115q150-45 300 0t300 0t300 0t300 0V200H0z" fill="rgb(255 255 255 / 0.08)" />
      <path
        d="M0 155q150-40 300 0t300 0t300 0t300 0"
        stroke="rgb(255 255 255 / 0.25)"
        strokeWidth="2"
      />
    </svg>
  )
}

// Painel da tela de login: a ilustração dentro de um círculo branco, como a janela
// redonda de um barco. O PNG tem fundo branco, que vira o próprio círculo, e o recorte
// redondo esconde as linhas soltas nas bordas da cena. Puramente decorativo.
export function SignInArtPanel() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-md bg-primary">
      <PanelWaves />
      <div className="relative grid aspect-square w-[min(76%,42rem)] place-items-center overflow-hidden rounded-full bg-white shadow-[0_24px_48px_-24px_rgb(15_23_42/0.45)] ring-[14px] ring-white/15">
        <img src={fishingIllustrationUrl} alt="" aria-hidden="true" className="w-full" />
      </div>
    </div>
  )
}
