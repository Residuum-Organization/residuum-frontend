import { z } from "zod";

const requiredString = (label) =>
  z
    .string({
      required_error: `${label} é obrigatório`,
      invalid_type_error: `${label} é obrigatório`,
    })
    .trim()
    .min(1, { message: `${label} é obrigatório` });

export const loginSchema = z.object({
  email: requiredString("E-mail").email({ message: "E-mail inválido" }),
  password: requiredString("Senha").min(6, {
    message: "Senha mínima de 6 caracteres",
  }),
});

export const registerSchema = z
  .object({
    name: requiredString("Nome").min(2, { message: "Nome muito curto" }),
    email: requiredString("E-mail").email({ message: "E-mail inválido" }),
    phone: z.string().optional(),
    password: requiredString("Senha").min(6, {
      message: "Senha mínima de 6 caracteres",
    }),
    confirmPassword: requiredString("Confirmação").min(6, {
      message: "Confirmação necessária",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });
