import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

const schema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  phone:           z.string().min(9, 'Phone number must be at least 9 digits'),
  email:           z.string().email('Invalid email address').optional().or(z.literal('')),
  password:        z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  address:         z.string().optional().or(z.literal('')),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await authService.register({
        name:     data.name,
        phone:    data.phone,
        email:    data.email || undefined,
        password: data.password,
        address:  data.address || undefined,
      })
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Create account</h1>
        <p className="text-slate-500">Join PharmaChain for a healthier life</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name"      type="text"  placeholder="Nguyen Van A" error={errors.name?.message}  required {...register('name')} />
        <Input label="Phone Number"   type="tel"   placeholder="0909 123 456" error={errors.phone?.message} required {...register('phone')} />
        <Input label="Email Address"  type="email" placeholder="you@example.com (optional)" error={errors.email?.message} {...register('email')} />
        <Input label="Address"        type="text"  placeholder="123 Nguyen Hue, District 1" error={errors.address?.message} {...register('address')} />
        <Input
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="Minimum 6 characters"
          error={errors.password?.message}
          required
          rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
          {...register('password')}
        />
        <Input label="Confirm Password" type={showPw ? 'text' : 'password'} placeholder="Re-enter password" error={errors.confirmPassword?.message} required {...register('confirmPassword')} />

        <Button type="submit" fullWidth size="lg" loading={isSubmitting} leftIcon={<UserPlus className="w-4 h-4" />}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
