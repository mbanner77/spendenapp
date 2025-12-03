'use client';

import { useState } from 'react';
import { Heart, Gift, Star, TreePine, Sparkles, Building2, Cross, ExternalLink, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import DonationForm from '@/components/DonationForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 animate-float opacity-30">
            <TreePine size={48} className="text-realcore-gold" />
          </div>
          <div className="absolute top-20 right-20 animate-float opacity-30" style={{ animationDelay: '1s' }}>
            <Star size={32} className="text-realcore-gold" />
          </div>
          <div className="absolute bottom-10 left-1/4 animate-sparkle opacity-30">
            <Sparkles size={24} className="text-realcore-gold" />
          </div>

          {/* Main Content */}
          <div className="text-center relative z-10">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <Image
                  src="https://realcore.info/bilder/rc-logo.png"
                  alt="RealCore Group Logo"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                  priority
                />
              </div>
            </div>

            {/* Festive Banner */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Gift className="text-realcore-gold" size={20} />
              <span className="text-realcore-gold font-medium">Weihnachten 2024</span>
              <Gift className="text-realcore-gold" size={20} />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-realcore-gold to-white bg-clip-text text-transparent">
                Spenden statt Geschenke
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
              Gemeinsam machen wir die Welt ein kleines Stück besser
            </p>
          </div>
        </div>
      </header>

      {/* Message Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="card-gradient rounded-2xl p-8 md:p-12">
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-6">
              Die Weihnachtszeit ist eine Zeit der Besinnung und des Gebens. Anstatt Ihnen in diesem Jahr ein traditionelles Weihnachtsgeschenk zukommen zu lassen, möchten wir gemeinsam mit Ihnen einen wertvollen Beitrag leisten. Wir haben uns entschieden, den Betrag, der für Ihre Präsente vorgesehen war, in eine Spende umzuwandeln.
            </p>

            <h2 className="text-2xl font-bold text-realcore-gold mb-4 flex items-center gap-2">
              <Star className="text-realcore-gold" size={24} />
              Ihre Entscheidung macht den Unterschied
            </h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Wir laden Sie herzlich ein, sich aktiv an dieser Aktion zu beteiligen. Wählen Sie aus unseren beiden sorgfältig ausgewählten Spendenpartnern – <strong>Lichtblicke e.V.</strong> und dem <strong>Krankenhausprojekt Diospi Suyana</strong> – die Organisation aus, die Ihnen am meisten am Herzen liegt.
            </p>

            <div className="bg-realcore-gold/10 border border-realcore-gold/30 rounded-xl p-6 mb-6">
              <p className="text-lg text-white/90 flex items-start gap-3">
                <Gift className="text-realcore-gold flex-shrink-0 mt-1" size={24} />
                <span>
                  Als Dankeschön für Ihre Unterstützung und Ihre wertvolle Zeit nehmen Sie mit Ihrer Wahl <strong>automatisch an unserem exklusiven Weihnachtsgewinnspiel</strong> teil. Füllen Sie dazu einfach das untenstehende Formular aus.
                </span>
              </p>
            </div>

            <p className="text-lg leading-relaxed text-white/90">
              Vielen Dank, dass Sie mit uns gemeinsam die Welt ein kleines Stück besser machen.
            </p>

            <p className="text-lg text-white/90 mt-6">
              Wir wünschen Ihnen und Ihrer Familie eine frohe und besinnliche Weihnachtszeit.
            </p>

            <p className="text-lg font-semibold text-realcore-gold mt-4">
              Ihr Team von der RealCore Group GmbH
            </p>
          </div>
        </div>
      </section>

      {/* Charity Organizations Section */}
      <section className="max-w-6xl mx-auto px-4 py-12" id="spenden">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Unsere Spendenpartner
        </h2>
        <p className="text-lg text-white/70 text-center mb-12 max-w-2xl mx-auto">
          Wählen Sie die Organisation, die Ihnen am meisten am Herzen liegt
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Lichtblicke e.V. */}
          <div className="card-gradient rounded-2xl p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Building2 className="text-yellow-400" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Lichtblicke e.V.</h3>
                <p className="text-white/60">Hilfe für Kinder in NRW</p>
              </div>
            </div>

            <p className="text-white/80 leading-relaxed mb-6">
              Die Aktion Lichtblicke e.V. kümmert sich besonders um Menschen unter uns, die schwere Schicksalsschläge hinnehmen müssen: Die Schwachen und Benachteiligten in unserer Gesellschaft, die keine Lobby für ihre Anliegen haben. Hier sind es vor allem Kinder, die besonders unter den Notsituationen leiden, in die ihre Familien geraten.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Und gerade den Kleinsten wollen wir Aufmerksamkeit, Solidarität und Mittel spenden. Kinder sind unsere Zukunft und haben die solidarische Hilfe aller verdient. Wir nehmen mit unserer Arbeit unsere gesellschaftliche Verantwortung wahr, wollen Lobby und Stimme sein und Hilfebedürftigen in Nordrhein-Westfalen tatkräftig helfen. <strong className="text-realcore-gold">Unbürokratisch, schnell und effektiv.</strong>
            </p>

            <a
              href="https://lichtblicke.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-realcore-gold hover:text-yellow-300 transition-colors font-medium"
            >
              Mehr erfahren <ExternalLink size={16} />
            </a>
          </div>

          {/* Diospi Suyana */}
          <div className="card-gradient rounded-2xl p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Cross className="text-emerald-400" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Diospi Suyana</h3>
                <p className="text-white/60">Krankenhaus in Peru</p>
              </div>
            </div>

            <p className="text-white/80 leading-relaxed mb-6">
              Diospi Suyana bietet medizinische Versorgung nach westlichem Standard zu günstigen Preisen. Seit der Eröffnung wurden bereits über 427.000 Patienten behandelt, die aus allen 25 Bundesstaaten Perus anreisen. Das Krankenhaus wird in den peruanischen Massenmedien als „Krankenhaus des Glaubens" bezeichnet, da es in der Tradition christlicher Nächstenliebe steht.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Mit Ihrer Unterstützung helfen Sie, dieses „Wunder" der modernen Medizin in einer der ärmsten Regionen Perus aufrechtzuerhalten. Sie ermöglichen es, dass Tausende von bedürftigen Menschen jährlich eine exzellente Behandlung erhalten. <strong className="text-realcore-gold">Ihre Spende ist ein direkter Beitrag zur Hoffnung und zur Heilung für die Ärmsten der Armen.</strong>
            </p>

            <a
              href="https://www.diospi-suyana.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-realcore-gold hover:text-yellow-300 transition-colors font-medium"
            >
              Mehr erfahren <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Prize Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="card-gradient rounded-2xl p-8 md:p-12 border-2 border-realcore-gold/30">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-realcore-gold/20 mb-4">
              <Sparkles className="text-realcore-gold" size={20} />
              <span className="text-realcore-gold font-semibold">Exklusives Gewinnspiel</span>
              <Sparkles className="text-realcore-gold" size={20} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gewinnen Sie TechHub Gutscheine
            </h2>
            <p className="text-lg text-white/70">
              Unter allen Teilnehmenden verlosen wir drei hochwertige Gutscheine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-yellow-500/20 to-transparent border border-yellow-500/30">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1. Preis</div>
              <div className="text-3xl font-bold text-white">5.000 €</div>
              <div className="text-white/60 mt-1">TechHub Gutschein</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-gray-400/20 to-transparent border border-gray-400/30">
              <div className="text-4xl font-bold text-gray-300 mb-2">2. Preis</div>
              <div className="text-3xl font-bold text-white">4.000 €</div>
              <div className="text-white/60 mt-1">TechHub Gutschein</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-amber-700/20 to-transparent border border-amber-700/30">
              <div className="text-4xl font-bold text-amber-600 mb-2">3. Preis</div>
              <div className="text-3xl font-bold text-white">3.000 €</div>
              <div className="text-white/60 mt-1">TechHub Gutschein</div>
            </div>
          </div>

          {/* TechHub Info */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-realcore-gold">
              Der RealCore TechHub: Ihr Partner für Technologie-Integration
            </h3>
            <p className="text-white/80 leading-relaxed mb-4">
              Der RealCore TechHub dient als zentraler Marktplatz für unsere technologieübergreifenden Beratungs- und Implementierungsleistungen. Unser Ziel ist es, Sie mit fundierter Expertise bei der digitalen Transformation zu unterstützen.
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              Wir bieten Ihnen "Starter Packages" an, die Ihnen einen schnellen und planbaren Einstieg in zukunftsweisende Technologien ermöglichen. Dank unserer Festpreis-Garantie können Sie risikofrei in Bereiche wie <strong>Künstliche Intelligenz (KI)</strong>, <strong>Cloud-native Entwicklung</strong> und <strong>Low-Code</strong> investieren.
            </p>
            <a
              href="https://techhub.realcore.de/landing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-realcore-gold hover:text-yellow-300 transition-colors font-medium"
            >
              TechHub entdecken <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto px-4 py-12" id="formular">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Jetzt teilnehmen
          </h2>
          <p className="text-lg text-white/70">
            Wählen Sie Ihre Spendenorganisation und nehmen Sie am Gewinnspiel teil
          </p>
        </div>

        <DonationForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://realcore.info/bilder/rc-logo.png"
                alt="RealCore Group Logo"
                width={120}
                height={36}
                className="h-8 w-auto"
              />
            </div>
            <div className="flex gap-6 text-sm text-white/60">
              <a href="/teilnahmebedingungen" className="hover:text-white transition-colors">
                Teilnahmebedingungen
              </a>
              <a href="/datenschutz" className="hover:text-white transition-colors">
                Datenschutz
              </a>
              <a href="https://realcore.de" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                realcore.de
              </a>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-white/40">
            © 2024 RealCore Group GmbH. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </main>
  );
}
