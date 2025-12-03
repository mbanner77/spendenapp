'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  LogOut,
  Mail,
  Server,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Send,
  Save,
  RefreshCw,
  Home,
} from 'lucide-react';

interface SMTPConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
  isEnvConfigured?: boolean;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [config, setConfig] = useState<SMTPConfig>({
    host: '',
    port: '587',
    user: '',
    pass: '',
    secure: false,
    from: 'noreply@realcore.de',
  });
  const [isEnvConfigured, setIsEnvConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (response.ok) {
        const data = await response.json();
        setConfig({
          host: data.host || '',
          port: data.port || '587',
          user: data.user || '',
          pass: '',
          secure: data.secure || false,
          from: data.from || 'noreply@realcore.de',
        });
        setIsEnvConfigured(data.isEnvConfigured || false);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Konfiguration erfolgreich gespeichert' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Fehler beim Speichern' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: 'error', text: 'Bitte geben Sie eine E-Mail-Adresse ein' });
      return;
    }

    setIsTesting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-realcore-gold" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="text-realcore-gold" />
              Admin-Bereich
            </h1>
            <p className="text-white/60 mt-1">SMTP-Konfiguration & E-Mail-Einstellungen</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <Home size={18} />
              Hauptseite
            </a>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Abmelden
            </button>
          </div>
        </div>

        {/* Environment Notice */}
        {isEnvConfigured && (
          <div className="card-gradient rounded-xl p-4 mb-6 border border-yellow-500/30 bg-yellow-500/10">
            <p className="text-yellow-300 text-sm flex items-center gap-2">
              <Shield size={18} />
              <span>
                <strong>Hinweis:</strong> SMTP ist über Umgebungsvariablen konfiguriert. Die unten gespeicherten Werte werden als Fallback verwendet.
              </span>
            </p>
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* SMTP Configuration */}
        <div className="card-gradient rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Server className="text-realcore-gold" size={24} />
            SMTP-Server Konfiguration
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Host */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                placeholder="z.B. smtp.office365.com"
              />
            </div>

            {/* Port */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Port
              </label>
              <input
                type="text"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                placeholder="587"
              />
            </div>

            {/* User */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Benutzername
              </label>
              <input
                type="text"
                value={config.user}
                onChange={(e) => setConfig({ ...config, user: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                placeholder="user@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={config.pass}
                onChange={(e) => setConfig({ ...config, pass: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* From */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Absender E-Mail
              </label>
              <input
                type="email"
                value={config.from}
                onChange={(e) => setConfig({ ...config, from: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                placeholder="noreply@realcore.de"
              />
            </div>

            {/* Secure */}
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={config.secure}
                    onChange={(e) => setConfig({ ...config, secure: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-realcore-gold transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-white/90">SSL/TLS verwenden (Port 465)</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 px-6 rounded-lg gold-gradient text-realcore-primary font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Speichern...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Konfiguration speichern
                </>
              )}
            </button>
            <button
              onClick={loadConfig}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Neu laden
            </button>
          </div>
        </div>

        {/* Test Email */}
        <div className="card-gradient rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Mail className="text-realcore-gold" size={24} />
            Test-E-Mail senden
          </h2>

          <p className="text-white/70 mb-4">
            Senden Sie eine Test-E-Mail, um die SMTP-Konfiguration zu überprüfen.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
              placeholder="empfaenger@example.com"
            />
            <button
              onClick={handleTestEmail}
              disabled={isTesting}
              className="px-6 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Senden...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Test senden
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-2 text-white/90">Hinweise zur Konfiguration</h3>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• <strong>Office 365:</strong> smtp.office365.com, Port 587</li>
            <li>• <strong>Gmail:</strong> smtp.gmail.com, Port 587 (App-Passwort erforderlich)</li>
            <li>• <strong>SSL/TLS:</strong> Aktivieren Sie diese Option für Port 465</li>
            <li>• Umgebungsvariablen haben Vorrang vor der gespeicherten Konfiguration</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
