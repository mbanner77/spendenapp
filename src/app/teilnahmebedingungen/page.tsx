import { Heart, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
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
            <FileText className="text-realcore-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Teilnahmebedingungen</h1>
            <p className="text-white/60">RealCore Weihnachtsgewinnspiel 2025</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="card-gradient rounded-2xl p-8 md:p-10">
          <div className="prose prose-lg prose-invert max-w-none">
            <h2 className="text-xl font-bold text-realcore-gold mb-4">1. Veranstalter</h2>
            <p className="text-white/80 mb-6">
              Veranstalter des Gewinnspiels ist die RealCore Group GmbH (nachfolgend "Veranstalter" genannt).
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">2. Teilnahmeberechtigung</h2>
            <p className="text-white/80 mb-6">
              Teilnahmeberechtigt sind alle natürlichen Personen, die das 18. Lebensjahr vollendet haben und 
              ihren Wohnsitz in Deutschland haben. Mitarbeiter des Veranstalters sowie deren Angehörige sind 
              von der Teilnahme ausgeschlossen. Eine Mehrfachteilnahme ist nicht zulässig.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">3. Teilnahmezeitraum</h2>
            <p className="text-white/80 mb-6">
              Das Gewinnspiel beginnt mit der Veröffentlichung dieser Seite und endet am 31.12.2025 um 23:59 Uhr (MEZ). 
              Teilnahmen, die nach diesem Zeitpunkt eingehen, werden nicht berücksichtigt.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">4. Teilnahme</h2>
            <p className="text-white/80 mb-6">
              Die Teilnahme erfolgt durch das vollständige Ausfüllen des Teilnahmeformulars auf dieser Website. 
              Die Teilnahme ist kostenlos und nicht an den Kauf von Waren oder Dienstleistungen gebunden. 
              Mit der Teilnahme wählen Sie gleichzeitig eine der beiden Spendenorganisationen aus, an die 
              RealCore einen Betrag spenden wird.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">5. Gewinne</h2>
            <p className="text-white/80 mb-4">
              Folgende Preise werden verlost:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
              <li>1. Preis: TechHub Gutschein im Wert von 5.000 €</li>
              <li>2. Preis: TechHub Gutschein im Wert von 4.000 €</li>
              <li>3. Preis: TechHub Gutschein im Wert von 3.000 €</li>
            </ul>
            <p className="text-white/80 mb-6">
              Die Gutscheine können für Beratungs- und Implementierungsleistungen des RealCore TechHub eingelöst werden.
              Eine Barauszahlung der Gewinne ist nicht möglich. Die Gewinne sind nicht übertragbar.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">6. Gewinnermittlung</h2>
            <p className="text-white/80 mb-6">
              Die Gewinner werden nach Ende des Teilnahmezeitraums durch Losverfahren ermittelt. Die Gewinner 
              werden per E-Mail an die bei der Teilnahme angegebene E-Mail-Adresse benachrichtigt. Meldet sich 
              ein Gewinner nicht innerhalb von 14 Tagen nach Benachrichtigung, verfällt der Gewinn und ein 
              neuer Gewinner wird ausgelost.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">7. Datenschutz</h2>
            <p className="text-white/80 mb-6">
              Die im Rahmen des Gewinnspiels erhobenen personenbezogenen Daten werden ausschließlich zur 
              Durchführung und Abwicklung des Gewinnspiels verwendet. Eine Weitergabe an Dritte erfolgt nicht, 
              es sei denn, dies ist zur Durchführung des Gewinnspiels erforderlich. Nach Beendigung des 
              Gewinnspiels werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten 
              entgegenstehen. Weitere Informationen finden Sie in unseren{' '}
              <Link href="/datenschutz" className="text-realcore-gold hover:underline">
                Datenschutzhinweisen
              </Link>.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">8. Haftungsausschluss</h2>
            <p className="text-white/80 mb-6">
              Der Veranstalter haftet nicht für technische Störungen, die eine Teilnahme am Gewinnspiel 
              verhindern oder beeinträchtigen. Der Rechtsweg ist ausgeschlossen.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">9. Änderungen der Teilnahmebedingungen</h2>
            <p className="text-white/80 mb-6">
              Der Veranstalter behält sich vor, das Gewinnspiel jederzeit ohne Vorankündigung zu beenden, 
              falls unvorhergesehene Umstände dies erforderlich machen. Der Veranstalter behält sich ferner 
              vor, diese Teilnahmebedingungen jederzeit zu ändern.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">10. Salvatorische Klausel</h2>
            <p className="text-white/80 mb-6">
              Sollten einzelne Bestimmungen dieser Teilnahmebedingungen unwirksam sein oder werden, bleibt 
              die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>

            <h2 className="text-xl font-bold text-realcore-gold mb-4">11. Anwendbares Recht</h2>
            <p className="text-white/80 mb-6">
              Es gilt ausschließlich das Recht der Bundesrepublik Deutschland.
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
