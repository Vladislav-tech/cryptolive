import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  LogOut,
  Mail,
  ShieldCheck,
  Star,
  Calendar,
  Copy,
  Clock,
  TrendingUp,
  Check,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserInfo } from '@/api/getUserInfoApi';
import { capitalize } from '@/utils/capitalize';
import { useState } from 'react';
import type { UserInfo } from '@/api/getUserInfoApi';
import { formatDate } from '@/utils/formatDate';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { auth } = Route.useRouteContext()
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { data: userInfo, isLoading } = useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await auth.logout();
    },

    onSuccess: () => {
      toast.success('You logout from account', {
        description: 'See you later!',
      });
      navigate({ to: '/login', search: { redirect: '' } });
      queryClient.clear();
    },

    onError: (error) => {
      toast.error('Failed to logout');
      console.error(error);
    },
  });

  const copyEmail = () => {
    if (userInfo?.email) {
      navigator.clipboard.writeText(userInfo.email);
      setCopied(true);
      toast.success('Email copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you really want to logout?')) {
      setIsLeaving(true);
      logoutMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-slate-800/50 rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-36 bg-slate-800/50 rounded-2xl" />
            <div className="h-36 bg-slate-800/50 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-4xl mx-auto space-y-8">
        <div
          className="
            backdrop-blur-xl bg-slate-900/60 border border-slate-700/50
            rounded-3xl shadow-2xl shadow-black/40 p-8 sm:p-10
            animate-fade-in-up
          "
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative">
              <div
                className="
                  relative w-28 h-28 sm:w-36 sm:h-36 rounded-full
                  bg-slate-700
                  flex items-center justify-center shrink-0
                  ring-4 ring-slate-600/50
                "
              >
                <span className="text-5xl sm:text-6xl font-bold text-white">
                  {capitalize(userInfo?.name?.[0] || '?')}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2 rounded-full ring-4 ring-slate-900">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {capitalize(userInfo?.name || 'User')}
              </h1>

              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <div
                  className="
                    flex items-center gap-2 px-4 py-2
                    bg-slate-800/60 backdrop-blur-sm border border-slate-700/50
                    rounded-xl text-slate-300
                    hover:bg-slate-800/80 hover:border-slate-600/60
                    transition-all duration-200 cursor-pointer
                  "
                  onClick={copyEmail}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && copyEmail()}
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{userInfo?.email}</span>
                  <Copy
                    className={`w-4 h-4 transition-colors ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  />
                </div>
                {copied && (
                  <span className="text-emerald-400 text-sm font-medium animate-fade-in">
                    Copied!
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-4 justify-center sm:justify-start">
                <div
                  className="
                    flex items-center gap-2 px-4 py-2.5
                    bg-slate-800/40 backdrop-blur-sm border border-slate-700/50
                    rounded-xl text-sm
                  "
                >
                  <div className="p-1.5 bg-blue-500/10 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-medium">Joined</p>
                    <p className="text-slate-200 font-semibold">
                      {formatDate({ dateString: userInfo?.registrationDate || '', shortType: true })}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex items-center gap-2 px-4 py-2.5
                    bg-slate-800/40 backdrop-blur-sm border border-slate-700/50
                    rounded-xl text-sm
                  "
                >
                  <div className="p-1.5 bg-purple-500/10 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-medium">Last active</p>
                    <p className="text-slate-200 font-semibold">
                      {formatDate({ dateString: userInfo?.lastSignInDate || '', shortType: false })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/favorites"
            className="
              group
              bg-slate-900/50 backdrop-blur-xl border border-slate-700/50
              rounded-2xl p-6
              hover:bg-slate-800/60 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/20
              transition-all duration-300
              animate-fade-in-up
            "
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Favorites</h3>
                  <p className="text-2xl font-bold text-indigo-400 mt-1">
                    {userInfo?.favorites ?? 0}
                  </p>
                  <p className="text-slate-500 text-sm">tracked coins</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>

          <div
            className="
              bg-slate-900/50 backdrop-blur-xl border border-slate-700/50
              rounded-2xl p-6
              opacity-60 hover:opacity-80
              transition-all duration-300
              animate-fade-in-up
            "
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-700/30">
                  <ShieldCheck className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Security</h3>
                  <p className="text-slate-500 text-sm">Coming soon</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-400 font-medium">
                Soon
              </span>
            </div>
          </div>

          <div
            className="
              group
              bg-slate-900/50 backdrop-blur-xl border border-slate-700/50
              rounded-2xl p-6
              hover:bg-slate-800/60 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20
              transition-all duration-300
              animate-fade-in-up
            "
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Status</h3>
                  <p className="text-emerald-400 font-semibold text-sm">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending || isLeaving}
          className="
            group w-full flex items-center justify-center gap-3 py-4 px-6
            bg-rose-600/80 hover:bg-rose-600
            text-white font-semibold rounded-xl
            transition-all duration-200
            shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30
            hover:scale-[1.01] active:scale-[0.99]
            focus:outline-none focus:ring-2 focus:ring-rose-500/40
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            animate-fade-in-up cursor-pointer
          "
          style={{ animationDelay: '0.25s' }}
        >
          {logoutMutation.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
}