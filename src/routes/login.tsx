import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query'
import api from '@/api/axiosInstance';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await api.post('/login', data);
      localStorage.setItem('token', response.data.accessToken);
      
      return response.data;
    },

    onSuccess: () => {
      toast.success('Welcome');
      navigate({ to: '/profile'});
    },

    onError: (err: any) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to login';
      toast.error(message);
      console.log(err);
    }
  })

  const onSubmit = async (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800/50 backdrop-blur-lg border border-slate-700/60 rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Sign In</h2>
          <p className="mt-2 text-sm text-slate-400">Welcome back to CryptoLive</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

          <div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email"
                className={`
                  block w-full pl-10 pr-3 py-3 rounded-lg
                  bg-slate-800/40 backdrop-blur-md border
                  ${errors.email
                    ? 'border-rose-500/60 animate-shake'
                    : dirtyFields.email && !errors.email
                    ? 'border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'border-slate-700/60'}
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
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`
                  block w-full pl-10 pr-10 py-3 rounded-lg
                  bg-slate-800/40 backdrop-blur-md border
                  ${errors.password
                    ? 'border-rose-500/60 animate-shake'
                    : dirtyFields.password && !errors.password
                    ? 'border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'border-slate-700/60'}
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="h-6 mt-1">
              {errors.password && (
                <p className="text-sm text-rose-400">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
              disabled={loginMutation.isPending}
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
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 space-y-2">
          <div>
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </div>
          <div>
            <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}