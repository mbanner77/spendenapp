'use client';

import { useState } from 'react';
import { Send, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface FormData {
  name: string;
  firma: string;
  position: string;
  email: string;
  spendenauswahl: string;
  teilnahmebedingungen: boolean;
}

interface FormErrors {
  name?: string;
  firma?: string;
  position?: string;
  email?: string;
  spendenauswahl?: string;
  teilnahmebedingungen?: string;
}

export default function DonationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    firma: '',
    position: '',
    email: '',
    spendenauswahl: '',
    teilnahmebedingungen: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bitte geben Sie Ihren Namen ein';
    }

    if (!formData.firma.trim()) {
      newErrors.firma = 'Bitte geben Sie Ihre Firma ein';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Bitte geben Sie Ihre Position ein';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    if (!formData.spendenauswahl) {
      newErrors.spendenauswahl = 'Bitte wählen Sie eine Spendenorganisation';
    }

    if (!formData.teilnahmebedingungen) {
      newErrors.teilnahmebedingungen = 'Bitte akzeptieren Sie die Teilnahmebedingungen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Redirect to thank you page
        window.location.href = '/danke';
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Calculate form completion progress
  const getProgress = () => {
    let completed = 0;
    if (formData.name.trim()) completed++;
    if (formData.firma.trim()) completed++;
    if (formData.position.trim()) completed++;
    if (formData.email.trim()) completed++;
    if (formData.spendenauswahl) completed++;
    if (formData.teilnahmebedingungen) completed++;
    return Math.round((completed / 6) * 100);
  };

  const progress = getProgress();

  return (
    <form onSubmit={handleSubmit} className="card-gradient rounded-2xl p-8 md:p-10">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Fortschritt</span>
          <span className="text-sm font-bold text-realcore-gold">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full progress-bar rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {progress < 100 ? 'Füllen Sie alle Pflichtfelder aus' : '✓ Alle Felder ausgefüllt'}
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name (Titel, Vor- und Nachname) <span className="text-realcore-gold">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-white border ${
              errors.name ? 'border-red-500' : 'border-gray-800'
            } text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors`}
            placeholder="z.B. Dr. Max Mustermann"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.name}
            </p>
          )}
        </div>

        {/* Firma */}
        <div>
          <label htmlFor="firma" className="block text-sm font-medium text-gray-700 mb-2">
            Firma <span className="text-realcore-gold">*</span>
          </label>
          <input
            type="text"
            id="firma"
            name="firma"
            value={formData.firma}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-white border ${
              errors.firma ? 'border-red-500' : 'border-gray-800'
            } text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors`}
            placeholder="Name Ihres Unternehmens"
          />
          {errors.firma && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.firma}
            </p>
          )}
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
            Position <span className="text-realcore-gold">*</span>
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-white border ${
              errors.position ? 'border-red-500' : 'border-gray-800'
            } text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors`}
            placeholder="Ihre Berufsbezeichnung"
          />
          {errors.position && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.position}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail <span className="text-realcore-gold">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-white border ${
              errors.email ? 'border-red-500' : 'border-gray-800'
            } text-gray-800 placeholder-gray-400 focus:border-realcore-gold focus:ring-2 focus:ring-realcore-gold/30 transition-colors`}
            placeholder="ihre.email@beispiel.de"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.email}
            </p>
          )}
        </div>

        {/* Donation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Spendenauswahl <span className="text-realcore-gold">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lichtblicke Option */}
            <label
              className={`relative flex items-start gap-3 sm:gap-4 p-4 sm:p-4 rounded-xl cursor-pointer transition-all touch-manipulation active:scale-[0.98] ${
                formData.spendenauswahl === 'lichtblicke'
                  ? 'bg-yellow-50 border-2 border-yellow-500 shadow-sm'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="spendenauswahl"
                value="lichtblicke"
                checked={formData.spendenauswahl === 'lichtblicke'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="w-14 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0 p-1">
                <Image
                  src="https://lichtblicke.de/assets/uploads/logos/libli_logo_weit.png"
                  alt="Lichtblicke e.V."
                  width={100}
                  height={40}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Lichtblicke e.V.</div>
                <div className="text-sm text-gray-500">Hilfe für Kinder in NRW</div>
              </div>
              {formData.spendenauswahl === 'lichtblicke' && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>

            {/* Diospi Suyana Option */}
            <label
              className={`relative flex items-start gap-3 sm:gap-4 p-4 sm:p-4 rounded-xl cursor-pointer transition-all touch-manipulation active:scale-[0.98] ${
                formData.spendenauswahl === 'diospi-suyana'
                  ? 'bg-emerald-50 border-2 border-emerald-500 shadow-sm'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="spendenauswahl"
                value="diospi-suyana"
                checked={formData.spendenauswahl === 'diospi-suyana'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="w-14 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0 p-1">
                <Image
                  src="https://www.diospi-suyana.de/wp-content/uploads/2020/02/Logo_DS_2020-c.png"
                  alt="Diospi Suyana"
                  width={100}
                  height={40}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Diospi Suyana</div>
                <div className="text-sm text-gray-500">Krankenhaus in Peru</div>
              </div>
              {formData.spendenauswahl === 'diospi-suyana' && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>
          </div>
          {errors.spendenauswahl && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.spendenauswahl}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Teilnahmebedingungen Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                name="teilnahmebedingungen"
                checked={formData.teilnahmebedingungen}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div
                className={`w-5 h-5 rounded border-2 ${
                  errors.teilnahmebedingungen ? 'border-red-500' : 'border-gray-400'
                } peer-checked:bg-realcore-gold peer-checked:border-realcore-gold transition-colors flex items-center justify-center`}
              >
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-600">
              Ich habe die{' '}
              <a
                href="/teilnahmebedingungen"
                target="_blank"
                className="text-realcore-gold hover:underline inline-flex items-center gap-1"
              >
                Teilnahmebedingungen <ExternalLink size={12} />
              </a>{' '}
              gelesen und akzeptiere sie. <span className="text-realcore-gold">*</span>
            </span>
          </label>
          {errors.teilnahmebedingungen && (
            <p className="text-sm text-red-400 flex items-center gap-1 ml-8">
              <AlertCircle size={14} /> {errors.teilnahmebedingungen}
            </p>
          )}

          {/* Privacy Notice (Information only) */}
          <div className="danke-box rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Die Datenschutzhinweise zu diesem Gewinnspiel finden Sie unter:{' '}
              <a
                href="/datenschutz"
                target="_blank"
                className="text-realcore-gold hover:underline inline-flex items-center gap-1"
              >
                Datenschutzhinweise <ExternalLink size={12} />
              </a>
            </p>
          </div>
        </div>

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || progress < 100}
          className={`w-full py-4 px-6 rounded-xl gold-gradient text-realcore-primary font-semibold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${progress === 100 ? 'btn-gold pulse-gold' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Wird gesendet...
            </>
          ) : (
            <>
              <Send size={20} />
              Jetzt teilnehmen
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Mit dem Absenden nehmen Sie automatisch am Gewinnspiel teil.
        </p>
      </div>
    </form>
  );
}
