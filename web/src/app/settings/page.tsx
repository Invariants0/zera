"use client";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { User, Shield, Bell, Eye, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 pb-32">
      
      <div className="mb-12">
        <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Account Settings
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2">
          Manage your profile, security preferences, and institutional identity.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 font-mono text-sm uppercase">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-lime font-bold">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
            <SettingsIcon className="w-4 h-4" /> Preferences
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
            <Eye className="w-4 h-4" /> Appearance
          </button>
        </div>

        {/* Content Area */}
        <Card className="flex-1 bg-obsidian border-white/10 p-8">
          <h2 className="text-2xl font-grotesk font-bold mb-8">Profile Details</h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-white/5">
              <div className="w-24 h-24 rounded-full bg-black border-2 border-white/10 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div>
                <Button variant="secondary" className="h-10 text-xs font-mono bg-white/5 border-white/10 mb-2">Change Avatar</Button>
                <p className="text-[10px] text-text-muted font-mono uppercase">Max size: 5MB</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Username</label>
                <Input defaultValue="Institutional Vault" className="h-12 bg-black border-white/10" />
              </div>
              
              <div>
                <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Bio</label>
                <textarea rows={4} defaultValue="Verified institutional custody solution specializing in high-value digital artifacts..." className="w-full rounded-xl bg-black border border-white/10 p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-lime resize-none"></textarea>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Email Address</label>
                <div className="flex gap-4">
                  <Input defaultValue="admin@vault.institution" type="email" className="h-12 bg-black border-white/10 flex-1" />
                  <Button variant="secondary" className="h-12 border-white/10 shrink-0">Verify</Button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-end">
               <Button variant="primary" className="h-12 px-8">Save Changes</Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
