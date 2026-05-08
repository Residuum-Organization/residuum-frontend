import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha mínima de 6 caracteres' }),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Nome muito curto' }),
    email: z.string().email({ message: 'E-mail inválido' }),
    phone: z.string().optional(),
    password: z.string().min(6, { message: 'Senha mínima de 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Confirmação necessária' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })
