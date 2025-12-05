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
  Users,
  Download,
  Trash2,
  BarChart3,
  Building2,
  Cross,
  Calendar,
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

interface Submission {
  id: number;
  name: string;
  firma: string;
  position: string;
  email: string;
  spendenauswahl: string;
  created_at: string;
}

interface Stats {
  total: number;
  lichtblicke: number;
  diospiSuyana: number;
  todayCount: number;
  thisWeekCount: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'submissions' | 'smtp';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('submissions');
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
  
  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  useEffect(() => {
    loadConfig();
    loadSubmissions();
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

  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const response = await fetch('/api/admin/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm('Möchten Sie diese Teilnahme wirklich löschen?')) return;
    
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Teilnahme gelöscht' });
        loadSubmissions();
      } else {
        setMessage({ type: 'error', text: 'Fehler beim Löschen' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' });
    }
  };

  const handleExport = () => {
    window.open('/api/admin/submissions?action=export', '_blank');
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-realcore-gold" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
              <Settings className="text-realcore-gold" />
              Admin-Bereich
            </h1>
            <p className="text-gray-500 mt-1">Teilnahmen verwalten & SMTP-Konfiguration</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-2"
            >
              <Home size={18} />
              Hauptseite
            </a>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Abmelden
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === 'submissions'
                ? 'border-realcore-gold text-realcore-gold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={18} />
            Teilnahmen
          </button>
          <button
            onClick={() => setActiveTab('smtp')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === 'smtp'
                ? 'border-realcore-gold text-realcore-gold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail size={18} />
            E-Mail Konfiguration
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-300 text-green-700'
                : 'bg-red-100 border border-red-300 text-red-700'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BarChart3 className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                      <p className="text-xs text-gray-500">Gesamt</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Building2 className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stats.lichtblicke}</p>
                      <p className="text-xs text-gray-500">Lichtblicke</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Cross className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stats.diospiSuyana}</p>
                      <p className="text-xs text-gray-500">Diospi Suyana</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Calendar className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stats.todayCount}</p>
                      <p className="text-xs text-gray-500">Heute</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Calendar className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stats.thisWeekCount}</p>
                      <p className="text-xs text-gray-500">Diese Woche</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={loadSubmissions}
                disabled={isLoadingSubmissions}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} className={isLoadingSubmissions ? 'animate-spin' : ''} />
                Aktualisieren
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                CSV Export
              </button>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firma</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">E-Mail</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Spende</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Datum</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          {isLoadingSubmissions ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="animate-spin" size={20} />
                              Laden...
                            </div>
                          ) : (
                            'Noch keine Teilnahmen vorhanden'
                          )}
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{sub.name}</div>
                            <div className="text-xs text-gray-500">{sub.position}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{sub.firma}</td>
                          <td className="px-4 py-3">
                            <a href={`mailto:${sub.email}`} className="text-blue-600 hover:underline">
                              {sub.email}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              sub.spendenauswahl === 'lichtblicke'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {sub.spendenauswahl === 'lichtblicke' ? (
                                <><Building2 size={12} /> Lichtblicke</>
                              ) : (
                                <><Cross size={12} /> Diospi Suyana</>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(sub.created_at).toLocaleString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                              title="Löschen"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SMTP Tab */}
        {activeTab === 'smtp' && (
          <div className="space-y-6">
            {/* Environment Notice */}
            {isEnvConfigured && (
              <div className="rounded-xl p-4 border border-yellow-300 bg-yellow-50">
                <p className="text-yellow-700 text-sm flex items-center gap-2">
                  <Shield size={18} />
                  <span>
                    <strong>Hinweis:</strong> SMTP ist über Umgebungsvariablen konfiguriert. Die unten gespeicherten Werte werden als Fallback verwendet.
                  </span>
                </p>
              </div>
            )}

            {/* SMTP Configuration */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Server className="text-realcore-gold" size={24} />
                SMTP-Server Konfiguration
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={config.host}
                    onChange={(e) => setConfig({ ...config, host: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                    placeholder="z.B. smtp.office365.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                  <input
                    type="text"
                    value={config.port}
                    onChange={(e) => setConfig({ ...config, port: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benutzername</label>
                  <input
                    type="text"
                    value={config.user}
                    onChange={(e) => setConfig({ ...config, user: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
                  <input
                    type="password"
                    value={config.pass}
                    onChange={(e) => setConfig({ ...config, pass: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Absender E-Mail</label>
                  <input
                    type="email"
                    value={config.from}
                    onChange={(e) => setConfig({ ...config, from: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                    placeholder="noreply@realcore.de"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={config.secure}
                        onChange={(e) => setConfig({ ...config, secure: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-realcore-gold transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow"></div>
                    </div>
                    <span className="text-gray-700">SSL/TLS verwenden (Port 465)</span>
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
                    <><Loader2 className="animate-spin" size={20} /> Speichern...</>
                  ) : (
                    <><Save size={20} /> Konfiguration speichern</>
                  )}
                </button>
                <button
                  onClick={loadConfig}
                  className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Neu laden
                </button>
              </div>
            </div>

            {/* Test Email */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Mail className="text-realcore-gold" size={24} />
                Test-E-Mail senden
              </h2>
              <p className="text-gray-500 mb-4">
                Senden Sie eine Test-E-Mail, um die SMTP-Konfiguration zu überprüfen.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                  placeholder="empfaenger@example.com"
                />
                <button
                  onClick={handleTestEmail}
                  disabled={isTesting}
                  className="px-6 py-3 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTesting ? (
                    <><Loader2 className="animate-spin" size={20} /> Senden...</>
                  ) : (
                    <><Send size={20} /> Test senden</>
                  )}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-700">Hinweise zur Konfiguration</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• <strong>Office 365:</strong> smtp.office365.com, Port 587</li>
                <li>• <strong>Gmail:</strong> smtp.gmail.com, Port 587 (App-Passwort erforderlich)</li>
                <li>• <strong>SSL/TLS:</strong> Aktivieren Sie diese Option für Port 465</li>
                <li>• Umgebungsvariablen haben Vorrang vor der gespeicherten Konfiguration</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
