import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../schemas/auth'

export default function RegisterForm(){
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    try{
      // chamar auth service de registro
      console.log('register', data)
    }catch(e){
      console.error(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">Nome</label>
        <input {...register('name')} className="w-full border p-2 rounded" />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

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

      <div>
        <label className="block text-sm">Confirmação de senha</label>
        <input type="password" {...register('confirmPassword')} className="w-full border p-2 rounded" />
        {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <button disabled={isSubmitting} className="w-full bg-blue-800 text-white p-2 rounded">
        Criar conta
      </button>
    </form>
  )
}
