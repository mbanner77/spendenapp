'use client';

import { useState, useEffect } from 'react';
import { Lock, Loader2, AlertCircle, Settings, LogOut } from 'lucide-react';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        const data = await response.json();
        setError(data.error || 'Anmeldung fehlgeschlagen');
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-realcore-gold" size={48} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-gradient rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-realcore-gold/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-realcore-gold" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin-Bereich</h1>
            <p className="text-gray-500 mt-2">Bitte melden Sie sich an</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Passwort
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-800 text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-lg gold-gradient text-realcore-primary font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Anmelden...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Anmelden
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          <a href="/" className="hover:text-gray-700 transition-colors">
            ← Zurück zur Hauptseite
          </a>
        </p>
      </div>
    </main>
  );
}
