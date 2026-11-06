// PUT /municipalities/:ibgeCode: só o nome é editável. O código é a chave e a UF vem dele.
export interface UpdateMunicipalityInput {
  ibgeCode: string
  data: { name: string }
}
