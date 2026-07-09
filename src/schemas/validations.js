import { z } from "zod";

export const cpfSchema = z.string().refine((val) => {
  const digits = val.replace(/\D/g, "");
  return digits.length === 11;
}, "CPF deve conter 11 dígitos");

export const cnpjSchema = z.string().refine((val) => {
  const digits = val.replace(/\D/g, "");
  return digits.length === 14;
}, "CNPJ deve conter 14 dígitos");

export const phoneSchema = z.string().refine((val) => {
  const digits = val.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
}, "Telefone deve conter 10 ou 11 dígitos");

export const emailSchema = z.string().email("E-mail inválido");
