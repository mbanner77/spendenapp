'use client';

import { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Default content if database is empty
const defaultContent = `<h2>1. Verantwortlicher</h2>
<p>Verantwortlich für die Datenverarbeitung im Rahmen dieses Gewinnspiels ist:</p>
<p>RealCore Group GmbH<br>[Adresse wird ergänzt]<br>E-Mail: events@realcore.de</p>

<h2>2. Erhobene Daten</h2>
<p>Im Rahmen des Gewinnspiels erheben wir folgende personenbezogene Daten:</p>
<ul>
<li>Name (Titel, Vor- und Nachname)</li>
<li>Firma</li>
<li>Position</li>
<li>E-Mail-Adresse</li>
<li>Ihre Spendenauswahl</li>
</ul>

<h2>3. Zweck der Datenverarbeitung</h2>
<p>Die erhobenen Daten werden ausschließlich für folgende Zwecke verwendet:</p>
<ul>
<li>Durchführung und Abwicklung des Gewinnspiels</li>
<li>Ermittlung und Benachrichtigung der Gewinner</li>
<li>Umsetzung Ihrer Spendenauswahl</li>
</ul>

<h2>4. Rechtsgrundlage</h2>
<p>Die Verarbeitung Ihrer Daten erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO, die Sie durch die Teilnahme am Gewinnspiel erteilen.</p>

<h2>5. Speicherdauer</h2>
<p>Ihre Daten werden nach Beendigung des Gewinnspiels und Abwicklung der Gewinnvergabe gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>

<h2>6. Ihre Rechte</h2>
<p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
<ul>
<li>Recht auf Auskunft (Art. 15 DSGVO)</li>
<li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
<li>Recht auf Löschung (Art. 17 DSGVO)</li>
<li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
<li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
<li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
<li>Recht auf Widerruf Ihrer Einwilligung</li>
</ul>
<p>Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: events@realcore.de</p>

<h2>7. Beschwerderecht</h2>
<p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.</p>

<h2>8. Weitergabe von Daten</h2>
<p>Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht, es sei denn, dies ist zur Durchführung des Gewinnspiels erforderlich oder gesetzlich vorgeschrieben.</p>

<h2>9. Kontakt</h2>
<p>Bei Fragen zum Datenschutz im Rahmen dieses Gewinnspiels wenden Sie sich bitte an:<br>E-Mail: events@realcore.de</p>`;

export default function PrivacyPage() {
  const [title, setTitle] = useState('Datenschutzhinweise');
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/pages?slug=datenschutz')
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
            <Shield className="text-realcore-primary" size={24} />
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
              className="prose prose-lg max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-realcore-gold [&_h2]:mb-4 [&_h2]:mt-6 first:[&_h2]:mt-0 [&_p]:text-gray-700 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:text-gray-700 [&_ul]:mb-6 [&_ul]:space-y-2 [&_li]:text-gray-700"
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
