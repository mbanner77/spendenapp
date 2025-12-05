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
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  X,
  Filter,
  TrendingUp,
  Languages,
  Edit3,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { translations as defaultTranslations, languages, Language } from '@/lib/translations';

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

type TabType = 'submissions' | 'smtp' | 'translations';

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
  
  // Search, sort, and selection state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'created_at' | 'name' | 'firma' | 'spendenauswahl'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filterOrg, setFilterOrg] = useState<'all' | 'lichtblicke' | 'diospi-suyana'>('all');
  
  // Confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id?: number; bulk?: boolean }>({ show: false });
  
  // Translations state
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('de');
  const [customTranslations, setCustomTranslations] = useState<Record<string, Record<string, string>>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [translationFilter, setTranslationFilter] = useState('');
  const [isSavingTranslation, setIsSavingTranslation] = useState(false);

  useEffect(() => {
    loadConfig();
    loadSubmissions();
    loadTranslations();
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

  const loadTranslations = async () => {
    try {
      const response = await fetch('/api/admin/translations');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.translations) {
          setCustomTranslations(data.translations);
        }
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  const saveTranslation = async (language: string, key: string, value: string) => {
    setIsSavingTranslation(true);
    try {
      const response = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, key, value }),
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Übersetzung gespeichert' });
        loadTranslations();
        setEditingKey(null);
      } else {
        setMessage({ type: 'error', text: 'Fehler beim Speichern' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' });
    } finally {
      setIsSavingTranslation(false);
    }
  };

  const resetTranslation = async (language: string, key: string) => {
    try {
      const response = await fetch(`/api/admin/translations?language=${language}&key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Übersetzung zurückgesetzt' });
        loadTranslations();
      } else {
        setMessage({ type: 'error', text: 'Fehler beim Zurücksetzen' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' });
    }
  };

  const getTranslationValue = (language: string, key: string): string => {
    return customTranslations[language]?.[key] || defaultTranslations[language as Language]?.[key] || '';
  };

  const isCustomTranslation = (language: string, key: string): boolean => {
    return !!customTranslations[language]?.[key];
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
        let successText = data.message;
        if (data.details) {
          successText += `\n📧 Message-ID: ${data.details.messageId || 'N/A'}`;
          successText += `\n📬 Server-Antwort: ${data.details.response || 'N/A'}`;
          if (data.details.accepted?.length > 0) {
            successText += `\n✅ Akzeptiert: ${data.details.accepted.join(', ')}`;
          }
          if (data.details.rejected?.length > 0) {
            successText += `\n❌ Abgelehnt: ${data.details.rejected.join(', ')}`;
          }
        }
        setMessage({ type: 'success', text: successText });
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' });
    } finally {
      setIsTesting(false);
    }
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter(sub => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        sub.name.toLowerCase().includes(searchLower) ||
        sub.firma.toLowerCase().includes(searchLower) ||
        sub.email.toLowerCase().includes(searchLower) ||
        sub.position.toLowerCase().includes(searchLower);
      
      // Organization filter
      const matchesOrg = filterOrg === 'all' || sub.spendenauswahl === filterOrg;
      
      return matchesSearch && matchesOrg;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'created_at') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'firma') {
        comparison = a.firma.localeCompare(b.firma);
      } else if (sortField === 'spendenauswahl') {
        comparison = a.spendenauswahl.localeCompare(b.spendenauswahl);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Selection handlers
  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map(s => s.id)));
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm.bulk) {
      // Bulk delete
      const idsToDelete = Array.from(selectedIds);
      for (const id of idsToDelete) {
        await handleDeleteSubmission(id);
      }
      setSelectedIds(new Set());
    } else if (deleteConfirm.id) {
      await handleDeleteSubmission(deleteConfirm.id);
    }
    setDeleteConfirm({ show: false });
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-realcore-gold" />
      : <ArrowDown size={14} className="text-realcore-gold" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-realcore-gold" size={48} />
      </div>
    );
  }

  return (
    <>
    {/* Delete Confirmation Modal */}
    {deleteConfirm.show && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-fadeInUp">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Löschen bestätigen</h3>
              <p className="text-gray-500 text-sm">Diese Aktion kann nicht rückgängig gemacht werden</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            {deleteConfirm.bulk 
              ? `Möchten Sie wirklich ${selectedIds.size} Einträge löschen?`
              : 'Möchten Sie diesen Eintrag wirklich löschen?'}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteConfirm({ show: false })}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Löschen
            </button>
          </div>
        </div>
      </div>
    )}
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
          <button
            onClick={() => setActiveTab('translations')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === 'translations'
                ? 'border-realcore-gold text-realcore-gold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Languages size={18} />
            Texte verwalten
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-300 text-green-700'
                : 'bg-red-100 border border-red-300 text-red-700'
            }`}
          >
            <span className="flex-shrink-0 mt-0.5">
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </span>
            <span className="whitespace-pre-line text-sm">{message.text}</span>
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

            {/* Search, Filter and Actions Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Suchen nach Name, Firma, E-Mail..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                {/* Organization Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-400" />
                  <select
                    value={filterOrg}
                    onChange={(e) => setFilterOrg(e.target.value as typeof filterOrg)}
                    className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                  >
                    <option value="all">Alle Organisationen</option>
                    <option value="lichtblicke">Lichtblicke e.V.</option>
                    <option value="diospi-suyana">Diospi Suyana</option>
                  </select>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={loadSubmissions}
                    disabled={isLoadingSubmissions}
                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={16} className={isLoadingSubmissions ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-3 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  {selectedIds.size > 0 && (
                    <button
                      onClick={() => setDeleteConfirm({ show: true, bulk: true })}
                      className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">{selectedIds.size} löschen</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Results info */}
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>
                  {filteredSubmissions.length} von {submissions.length} Einträgen
                  {searchTerm && ` für "${searchTerm}"`}
                </span>
                {selectedIds.size > 0 && (
                  <span className="text-realcore-gold font-medium">
                    {selectedIds.size} ausgewählt
                  </span>
                )}
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3 text-left">
                        <button
                          onClick={toggleSelectAll}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0 
                            ? <CheckSquare size={18} className="text-realcore-gold" />
                            : <Square size={18} />}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-realcore-gold"
                        >
                          Name <SortIcon field="name" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('firma')}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-realcore-gold"
                        >
                          Firma <SortIcon field="firma" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">E-Mail</th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('spendenauswahl')}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-realcore-gold"
                        >
                          Spende <SortIcon field="spendenauswahl" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('created_at')}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-realcore-gold"
                        >
                          Datum <SortIcon field="created_at" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          {isLoadingSubmissions ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="animate-spin" size={20} />
                              Laden...
                            </div>
                          ) : searchTerm || filterOrg !== 'all' ? (
                            'Keine Einträge gefunden'
                          ) : (
                            'Noch keine Teilnahmen vorhanden'
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr 
                          key={sub.id} 
                          className={`hover:bg-gray-50 transition-colors ${selectedIds.has(sub.id) ? 'bg-realcore-gold/5' : ''}`}
                        >
                          <td className="px-3 py-3">
                            <button
                              onClick={() => toggleSelect(sub.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {selectedIds.has(sub.id) 
                                ? <CheckSquare size={18} className="text-realcore-gold" />
                                : <Square size={18} />}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{sub.name}</div>
                            <div className="text-xs text-gray-500">{sub.position}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{sub.firma}</td>
                          <td className="px-4 py-3">
                            <a href={`mailto:${sub.email}`} className="text-blue-600 hover:underline text-sm">
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
                              onClick={() => setDeleteConfirm({ show: true, id: sub.id })}
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

        {/* Translations Tab */}
        {activeTab === 'translations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Languages className="text-realcore-gold" size={24} />
                Texte der App bearbeiten
              </h2>
              
              <p className="text-gray-500 mb-6">
                Hier können Sie alle Texte der App in allen Sprachen bearbeiten. Änderungen werden sofort wirksam.
              </p>

              {/* Language Selector */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sprache auswählen
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte filtern
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={translationFilter}
                      onChange={(e) => setTranslationFilter(e.target.value)}
                      placeholder="Suchen..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30"
                    />
                  </div>
                </div>
              </div>

              {/* Translations List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {Object.keys(defaultTranslations[selectedLanguage] || {})
                  .filter(key => {
                    if (!translationFilter) return true;
                    const searchLower = translationFilter.toLowerCase();
                    return key.toLowerCase().includes(searchLower) || 
                           getTranslationValue(selectedLanguage, key).toLowerCase().includes(searchLower);
                  })
                  .map((key) => (
                    <div 
                      key={key} 
                      className={`p-4 rounded-lg border ${
                        isCustomTranslation(selectedLanguage, key) 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{key}</code>
                          {isCustomTranslation(selectedLanguage, key) && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                              Angepasst
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {editingKey !== key && (
                            <button
                              onClick={() => {
                                setEditingKey(key);
                                setEditingValue(getTranslationValue(selectedLanguage, key));
                              }}
                              className="p-2 text-gray-500 hover:text-realcore-gold hover:bg-gray-100 rounded-lg transition-colors"
                              title="Bearbeiten"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          {isCustomTranslation(selectedLanguage, key) && (
                            <button
                              onClick={() => resetTranslation(selectedLanguage, key)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Auf Standard zurücksetzen"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {editingKey === key ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveTranslation(selectedLanguage, key, editingValue)}
                              disabled={isSavingTranslation}
                              className="px-4 py-2 rounded-lg gold-gradient text-realcore-primary font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                            >
                              {isSavingTranslation ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <Save size={16} />
                              )}
                              Speichern
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {getTranslationValue(selectedLanguage, key)}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-700">Hinweise zur Textverwaltung</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• <strong>Gelb markierte Texte</strong> wurden von Ihnen angepasst</li>
                <li>• Mit dem <RotateCcw size={14} className="inline" /> Icon setzen Sie einen Text auf den Standardwert zurück</li>
                <li>• Änderungen werden sofort auf der Website sichtbar (nach Seitenaktualisierung)</li>
                <li>• Die Standardtexte bleiben als Fallback erhalten</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
