import { Heart, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Zurück zur Startseite
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
            <Shield className="text-realcore-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Datenschutzhinweise</h1>
            <p className="text-white/60">RealCore Weihnachtsgewinnspiel 2025</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="card-gradient rounded-2xl p-8 md:p-10">
          {/* Notice Box */}
          <div className="bg-realcore-gold/10 border border-realcore-gold/30 rounded-xl p-6 mb-8">
            <p className="text-white/90">
              <strong className="text-realcore-gold">Hinweis:</strong> Diese Datenschutzhinweise werden aktuell 
              finalisiert und in Kürze vollständig zur Verfügung gestellt. Die wesentlichen Punkte zur 
              Datenverarbeitung im Rahmen des Gewinnspiels finden Sie bereits nachfolgend.
            </p>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <h2 className="text-xl font-bold text-realcore-gold mb-4">1. Verantwortlicher</h2>
            <p className="text-white/80 mb-6">
              Verantwortlich für die Datenverarbeitung im Rahmen dieses Gewinnspiels ist:<br /><br />
              RealCore Group GmbH<br />
              [Adresse wird ergänzt]<br />
              E-Mail: events@realcore.de
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">2. Erhobene Daten</h2>
            <p className="text-white/80 mb-4">
              Im Rahmen des Gewinnspiels erheben wir folgende personenbezogene Daten:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
              <li>Name (Titel, Vor- und Nachname)</li>
              <li>Firma</li>
              <li>Position</li>
              <li>E-Mail-Adresse</li>
              <li>Ihre Spendenauswahl</li>
            </ul>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">3. Zweck der Datenverarbeitung</h2>
            <p className="text-white/80 mb-4">
              Die erhobenen Daten werden ausschließlich für folgende Zwecke verwendet:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
              <li>Durchführung und Abwicklung des Gewinnspiels</li>
              <li>Ermittlung und Benachrichtigung der Gewinner</li>
              <li>Umsetzung Ihrer Spendenauswahl</li>
            </ul>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">4. Rechtsgrundlage</h2>
            <p className="text-white/80 mb-6">
              Die Verarbeitung Ihrer Daten erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a 
              DSGVO, die Sie durch die Teilnahme am Gewinnspiel erteilen.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">5. Speicherdauer</h2>
            <p className="text-white/80 mb-6">
              Ihre Daten werden nach Beendigung des Gewinnspiels und Abwicklung der Gewinnvergabe gelöscht, 
              sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">6. Ihre Rechte</h2>
            <p className="text-white/80 mb-4">
              Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerruf Ihrer Einwilligung</li>
            </ul>
            <p className="text-white/80 mb-6">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: events@realcore.de
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">7. Beschwerderecht</h2>
            <p className="text-white/80 mb-6">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer 
              personenbezogenen Daten zu beschweren.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">8. Weitergabe von Daten</h2>
            <p className="text-white/80 mb-6">
              Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht, es sei denn, dies ist zur Durchführung 
              des Gewinnspiels erforderlich oder gesetzlich vorgeschrieben.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">9. Kontakt</h2>
            <p className="text-white/80 mb-6">
              Bei Fragen zum Datenschutz im Rahmen dieses Gewinnspiels wenden Sie sich bitte an:<br />
              E-Mail: events@realcore.de
            </p>

            <div className="border-t border-white/20 pt-6 mt-8">
              <p className="text-white/60 text-sm">
                Stand: Dezember 2025<br />
                RealCore Group GmbH
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="https://realcore.info/bilder/rc-logo.png"
              alt="RealCore Group Logo"
              width={120}
              height={36}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-center mt-2 text-sm text-white/40">
            © 2025 RealCore Group GmbH. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </main>
  );
}
