import { z } from "zod";

export const tituloSchema = z
  .string()
  .trim()
  .min(1, "O título é obrigatório.")
  .max(120, "O título deve ter no máximo 120 caracteres.");

export const descricaoSchema = z
  .string()
  .trim()
  .max(500, "A descrição deve ter no máximo 500 caracteres.")
  .nullish()
  .transform((value) => (value ? value : undefined));

export const idSchema = z.uuid("Identificador inválido.");

export const taskInputSchema = z.object({
  titulo: tituloSchema,
  descricao: descricaoSchema,
});
