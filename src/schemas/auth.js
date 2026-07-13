import { z } from "zod";

const requiredString = (label) =>
  z
    .string({
      required_error: `${label} é obrigatório`,
      invalid_type_error: `${label} é obrigatório`,
    })
    .trim()
    .min(1, { message: `${label} é obrigatório` });

const requiredPhone = requiredString("Telefone").refine(
  (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10;
  },
  { message: "Telefone inválido" }
);

export const loginSchema = z.object({
  email: requiredString("E-mail").email({ message: "E-mail inválido" }),
  password: requiredString("Senha").min(6, {
    message: "Senha mínima de 6 caracteres",
  }),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: requiredString("Nome").min(2, { message: "Nome muito curto" }),
    email: requiredString("E-mail").email({ message: "E-mail inválido" }),
    phone: requiredPhone,
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

export const forgotPasswordSchema = z.object({
  email: requiredString("E-mail").email({ message: "E-mail inválido" }),
});
