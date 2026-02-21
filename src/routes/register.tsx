import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import type { IUserData } from '@/types/IUserData';
import api from '@/api/axiosInstance';

const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(20, 'Name must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Name can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type RegisterForm = z.infer<typeof registerSchema>;

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: IUserData) => {
      const response = await api.post('/registration', data);
      localStorage.setItem('token', response.data.accessToken);

    },

    onSuccess: () => {
      toast.success('Success!', {
        description: 'Activation link was sent on your email',
      });

    reset()
    },

    onError: (err: any) => {
      toast.error('Failed to register', {
        description: err?.response?.data?.message || err?.message || 'An error occurred',
      });
    }

  });

  const onSubmit = async (data: RegisterForm) => {
    console.log(data.email, data.password, data.name);
    const { confirmPassword, ...payload } = data;

    registerMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800/50 backdrop-blur-lg border border-slate-700/60 rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">Join CryptoLive today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Name"
                className={`
                  block w-full pl-10 pr-3 py-3
                  bg-slate-800/40 backdrop-blur-md border rounded-lg
                  ${errors.name ? 'border-rose-500/60' : 'border-slate-700/60'}
                  text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
                  transition-all duration-200
                `}
                {...register('name')}
              />
            </div>

            <div className="h-6 mt-1">
              {errors.name && (
                <p className="text-sm text-rose-400">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
                className={`
                  block w-full pl-10 pr-3 py-3
                  bg-slate-800/40 backdrop-blur-md border rounded-lg
                  ${errors.email ? 'border-rose-500/60' : 'border-slate-700/60'}
                  text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
                  transition-all duration-200
                `}
                {...register('email')}
              />
            </div>
            <div className="h-6 mt-1">
              {errors.email && (
                <p className="text-sm text-rose-400">{errors.email.message}</p>
              )}
            </div>
          </div>


          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`
                  block w-full pl-10 pr-10 py-3
                  bg-slate-800/40 backdrop-blur-md border rounded-lg
                  ${errors.password ? 'border-rose-500/60' : 'border-slate-700/60'}
                  text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
                  transition-all duration-200
                `}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="h-6 mt-1">
              {errors.password && (
                <p className="text-sm text-rose-400">{errors.password.message}</p>
              )}
            </div>
          </div>


          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className={`
                  block w-full pl-10 pr-10 py-3
                  bg-slate-800/40 backdrop-blur-md border rounded-lg
                  ${errors.confirmPassword ? 'border-rose-500/60' : 'border-slate-700/60'}
                  text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
                  transition-all duration-200
                `}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="h-6 mt-1">
              {errors.confirmPassword && (
                <p className="text-sm text-rose-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="
              w-full py-3 px-4
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-sm
              cursor-pointer
            "
          >
            {registerMutation.isPending ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}