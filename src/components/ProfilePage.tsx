import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 text-sm">Manage your profile and subscription preferences.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-32 bg-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full translate-x-4" />
            ))}
          </div>
        </div>
        <div className="px-8 pb-8 -mt-12 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            <div className="w-24 h-24 bg-white rounded-[2rem] p-1 shadow-lg ring-4 ring-white">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-full h-full rounded-[1.75rem] object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-50 rounded-[1.75rem] flex items-center justify-center">
                  <User className="w-10 h-10 text-indigo-400" />
                </div>
              )}
            </div>
            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-gray-900">{profile.displayName}</h2>
              <p className="text-gray-500 font-medium">{profile.email}</p>
            </div>
            <div className="pb-2">
              <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl uppercase tracking-wider">
                Pro Member
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-gray-900">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Status</p>
                <p className="text-sm font-bold text-gray-900">Verified & Active</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined On</p>
                <p className="text-sm font-bold text-gray-900">
                  {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'Today'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
             <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 cursor-pointer">
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
