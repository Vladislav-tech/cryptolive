import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { LogOut, Mail, ShieldCheck, Star, Calendar, Copy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserInfo } from '@/api/getUserInfoApi';
import { capitalize } from '@/utils/capitalize';
import { checkAuth, logout } from '@/api/authApi';
import { useEffect, useState } from 'react';
import type { UserInfo } from "@/api/getUserInfoApi";
import { formatDate } from '@/utils/formatDate';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const { data: userInfo, isLoading } = useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  })

  console.log(userInfo)

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },

    onSuccess: () => {
      toast.success('You logout from account', {
        description: 'See you later!',
      });
      navigate({ to: '/login' });
      queryClient.clear();
    },

    onError: (error) => {
      toast.error('Failed to logout');
      console.error(error);
    },
  })

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

  const copyEmail = () => {
    if (userInfo?.email) {
      navigator.clipboard.writeText(userInfo.email);
      setCopied(true);
      toast.success('Email copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-800/50 rounded-2xl" />
          <div className="h-48 bg-slate-800/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="
          backdrop-blur-xl bg-slate-900/50 border border-slate-700/60 
          rounded-2xl shadow-2xl shadow-black/30 p-8
        ">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            <div className="
              relative w-24 h-24 sm:w-32 sm:h-32 rounded-full 
              bg-linear-to-br from-blue-600 to-indigo-600 
              flex items-center justify-center shrink-0
              shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-500/20
            ">
              <span className="text-4xl sm:text-5xl font-bold text-white">
                {capitalize(userInfo?.name?.[0] || '?')}
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white">
                {capitalize(userInfo?.name || 'User')}
              </h1>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                <Mail className="w-5 h-5" />
                <span>{userInfo?.email}</span>
                <button
                  onClick={copyEmail}
                  className="p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
                  title="Copy email"
                >
                  <Copy className={`w-4 h-4 ${copied ? 'text-emerald-400' : 'text-slate-400'}`} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 justify-center sm:justify-start text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Registration: {formatDate({ dateString: userInfo?.registrationDate || '', shortType: true })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Last sign in: {formatDate({ dateString: userInfo?.lastSignInDate || '', shortType: false })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="
            bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 
            rounded-2xl p-6 hover:border-indigo-500/40 transition-colors
          ">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10">
                <Star className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Favorites</h3>
                <p className="text-slate-400">
                  {userInfo?.favorites ?? 0} coins
                </p>
              </div>
            </div>
            <Link
              to="/favorites"
              className="mt-4 inline-flex items-center text-indigo-400 hover:text-indigo-300"
            >
              Go to →
            </Link>
          </div>

          <div className="
            bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 
            rounded-2xl p-6 opacity-50 cursor-not-allowed
          ">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-700/30">
                <ShieldCheck className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Security</h3>
                <p className="text-slate-500">Soon</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you really want to logout?')) {
              logoutMutation.mutate();
            }
          }}
          className="
            w-full flex items-center justify-center gap-3 py-4 px-6
            bg-rose-600/80 hover:bg-rose-600
            text-white font-medium rounded-xl
            transition-all duration-200 shadow-lg shadow-rose-500/20
            focus:outline-none focus:ring-2 focus:ring-rose-500/40
            cursor-pointer
          "
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

}