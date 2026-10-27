const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Falha no boot: sem a URL da API nenhuma tela funciona, e o erro de rede
// que apareceria depois esconderia a causa real.
if (!apiBaseUrl) {
  throw new Error(
    `VITE_API_BASE_URL não definida (recebido: ${String(apiBaseUrl)}). ` +
      'Esperado uma URL como "http://localhost:3000/api/v1" no arquivo .env — copie o .env.example.',
  )
}

export const env = {
  apiBaseUrl,
} as const
