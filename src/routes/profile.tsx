import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { LogOut, User, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserInfo } from '@/api/getUserInfoApi';
import { capitalize } from '@/utils/capitalize';
import { checkAuth, logout } from '@/api/authApi';
import { useEffect } from 'react';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },

    onSuccess: () => {
      toast.success('You logout from account', {
        description: 'See you later!',
      });
      navigate({ to: '/login' });
    },

    onError: () => {
      toast.error('Failed to logout');
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ok = await checkAuth();
      if (!ok && mounted) {
        navigate({ to: '/login' });
        toast.error('You are not authenticated. Please login to access your profile.');
      }


      
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Manage your account information and settings here. You can view your email, username, and other details.
          </p>
        </div>


        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/60 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {isLoading ? '...' : capitalize(userInfo?.data?.name ?? '')[0]}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                {isLoading ? '...' : capitalize(userInfo?.data?.name ?? '')}

                <ShieldCheck className="h-5 w-5 text-emerald-400" />

              </h2>
              <p className="text-slate-400">{isLoading ? '...' : userInfo?.data.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-t border-slate-700/50">
              <Mail className="h-5 w-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-slate-100">{isLoading ? '...' : userInfo?.data.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-t border-slate-700/50">
              <User className="h-5 w-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-400">Username</p>
                <p className="text-slate-100">{isLoading ? '...' : capitalize(userInfo?.data?.name ?? '')}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-center gap-2
                py-3 px-4
                bg-rose-600/80 hover:bg-rose-600
                text-white font-medium
                rounded-lg
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-slate-950
                cursor-pointer
              "
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-slate-400 space-y-2">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Back to Home
          </Link>
          <span className="mx-3">•</span>
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login with another account
          </Link>
        </div>
      </div>
    </div>
  );
}