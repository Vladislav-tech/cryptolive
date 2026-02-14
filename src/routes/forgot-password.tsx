import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    // TODO: real backend
    await new Promise((resolve) => setTimeout(resolve, 1200)); // imitation

    toast.success('Reset link sent!', {
      description: `Check your email (${data.email}) for instructions`,
      duration: 6000,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-slate-800/50 backdrop-blur-lg border border-slate-700/60 rounded-xl p-6 sm:p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white">Check your inbox</h3>
            <p className="text-slate-400">
              We sent a password reset link to your email.  
              The link will expire in 1 hour.
            </p>
            <Link
              to="/login"
              className="inline-block text-blue-400 hover:text-blue-300 font-medium"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">

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
              <div className="h-5 mt-1">
                {errors.email && (
                  <p className="text-sm text-rose-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full py-3 px-4
                bg-blue-600 hover:bg-blue-700
                text-white font-medium
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-sm
              "
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center text-sm text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}