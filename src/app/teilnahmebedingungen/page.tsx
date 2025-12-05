'use client';

import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Default content if database is empty
const defaultContent = `<h2>1. Veranstalter</h2>
<p>Veranstalter des Gewinnspiels ist die RealCore Group GmbH.</p>

<h2>2. Teilnahmeberechtigung</h2>
<p>Teilnahmeberechtigt sind alle natürlichen Personen ab 18 Jahren mit Wohnsitz in Deutschland. Mitarbeiter der RealCore Group GmbH und deren Angehörige sind von der Teilnahme ausgeschlossen.</p>

<h2>3. Teilnahmezeitraum</h2>
<p>Das Gewinnspiel läuft vom 01.12.2025 bis zum 31.12.2025 (Teilnahmeschluss).</p>

<h2>4. Teilnahme</h2>
<p>Die Teilnahme erfolgt durch vollständiges Ausfüllen des Teilnahmeformulars und Auswahl einer Spendenorganisation. Pro Person ist nur eine Teilnahme möglich.</p>

<h2>5. Gewinne</h2>
<p>Es werden folgende TechHub-Gutscheine verlost:</p>
<ul>
<li>1. Preis: 5.000 € TechHub-Gutschein</li>
<li>2. Preis: 4.000 € TechHub-Gutschein</li>
<li>3. Preis: 3.000 € TechHub-Gutschein</li>
</ul>
<p>Die Gutscheine können für Beratungs- und Implementierungsleistungen des RealCore TechHub eingelöst werden. Eine Barauszahlung ist nicht möglich.</p>

<h2>6. Gewinnermittlung</h2>
<p>Die Gewinner werden nach dem Teilnahmeschluss per Zufallsverfahren ermittelt und per E-Mail benachrichtigt.</p>

<h2>7. Spendenauswahl</h2>
<p>Die Gesamtspendensumme wird entsprechend der Auswahl aller Teilnehmer auf die Spendenorganisationen aufgeteilt.</p>

<h2>8. Datenschutz</h2>
<p>Die erhobenen Daten werden ausschließlich zur Durchführung des Gewinnspiels verwendet. Weitere Informationen finden Sie in unseren <a href="/datenschutz">Datenschutzhinweisen</a>.</p>

<h2>9. Rechtsweg</h2>
<p>Der Rechtsweg ist ausgeschlossen.</p>`;

export default function TermsPage() {
  const [title, setTitle] = useState('Teilnahmebedingungen');
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/pages?slug=teilnahmebedingungen')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.page) {
          setTitle(data.page.title);
          setContent(data.page.content);
        }
      })
      .catch(err => console.log('Using default content'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Zurück zur Startseite
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
            <FileText className="text-realcore-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500">RealCore Weihnachtsgewinnspiel 2025</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="card-gradient rounded-2xl p-8 md:p-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-realcore-gold" size={32} />
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-realcore-gold [&_h2]:mb-4 [&_h2]:mt-6 first:[&_h2]:mt-0 [&_p]:text-gray-700 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:text-gray-700 [&_ul]:mb-6 [&_ul]:space-y-2 [&_li]:text-gray-700 [&_a]:text-realcore-gold [&_a]:hover:underline"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-500 text-sm">
              Stand: Dezember 2025<br />
              RealCore Group GmbH
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/realcore-logo.jpg"
              alt="RealCore Group Logo"
              width={120}
              height={36}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-center mt-2 text-sm text-gray-400">
            © 2025 RealCore Group GmbH. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </main>
  );
}
