import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  LogOut,
  Mail,
  ShieldCheck,
  Star,
  Calendar,
  Copy,
  Clock,
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
          <div className="h-40 bg-slate-800/50 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-800/50 rounded-xl" />
            <div className="h-32 bg-slate-800/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div
                className="
                  relative w-24 h-24 rounded-full
                  bg-gradient-to-br from-blue-600 to-indigo-600
                  flex items-center justify-center shrink-0
                "
              >
                <span className="text-3xl font-bold text-white">
                  {capitalize(userInfo?.name?.[0] || '?')}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 p-1.5 rounded-full ring-2 ring-slate-800">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-2">
                {capitalize(userInfo?.name || 'User')}
              </h1>

              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <div
                  className="
                    flex items-center gap-2 px-3.5 py-2
                    bg-slate-700/50 border border-slate-600/50
                    rounded-lg text-slate-300
                    hover:bg-slate-700/70 hover:border-slate-500/50
                    transition-colors cursor-pointer
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
                  <span className="text-emerald-400 text-sm font-medium">
                    Copied!
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                <div
                  className="
                    flex items-center gap-2.5 px-3.5 py-2
                    bg-slate-700/30 border border-slate-600/30
                    rounded-lg text-sm
                  "
                >
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-slate-500 text-xs font-medium">Joined</p>
                    <p className="text-slate-200 font-semibold">
                      {formatDate({ dateToFormat: userInfo?.registrationDate || '', shortType: 'short' })}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex items-center gap-2.5 px-3.5 py-2
                    bg-slate-700/30 border border-slate-600/30
                    rounded-lg text-sm
                  "
                >
                  <Clock className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-slate-500 text-xs font-medium">Last active</p>
                    <p className="text-slate-200 font-semibold">
                      {formatDate({ dateToFormat: userInfo?.lastSignInDate || '', shortType: 'detailed' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/favorites"
            className="
              group
              bg-slate-800/50 backdrop-blur border border-slate-700/50
              rounded-xl p-5
              hover:bg-slate-700/50 hover:border-indigo-500/50
              transition-all duration-200
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Favorites</h3>
                  <p className="text-xl font-bold text-indigo-400 mt-0.5">
                    {userInfo?.favorites ?? 0}
                  </p>
                  <p className="text-slate-500 text-xs">tracked coins</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <div
            className="
              bg-slate-800/50 backdrop-blur border border-slate-700/50
              rounded-xl p-5
              opacity-70
            "
          >
            <div className="flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-slate-700/30">
                  <ShieldCheck className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Security</h3>
                  <p className="text-slate-500 text-sm">Coming soon</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-slate-700/50 rounded-full text-xs text-slate-400 font-medium">
                Soon
              </span>
            </div>
          </div>

          <div
            className="
              bg-slate-800/50 backdrop-blur border border-slate-700/50
              rounded-xl p-5
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Status</h3>
                  <p className="text-emerald-400 font-semibold text-sm">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending || isLeaving}
          className="
            group w-full flex items-center justify-center gap-2.5 py-3 px-6
            bg-rose-600 hover:bg-rose-500
            text-white font-medium rounded-lg
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
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