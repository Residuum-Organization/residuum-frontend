import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../schemas/auth'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginForm(){
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const { login } = useAuth()

  const onSubmit = async (data) => {
    try{
      await login(data.email, data.password)
    }catch(e){
      console.error(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">E-mail</label>
        <input {...register('email')} className="w-full border p-2 rounded" />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm">Senha</label>
        <input type="password" {...register('password')} className="w-full border p-2 rounded" />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button disabled={isSubmitting} className="w-full bg-blue-800 text-white p-2 rounded">
        Entrar
      </button>
    </form>
  )
}
