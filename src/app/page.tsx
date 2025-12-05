'use client';

import { Heart, Gift, Star, TreePine, Sparkles, ExternalLink, Users } from 'lucide-react';
import Image from 'next/image';
import DonationForm from '../components/DonationForm';
import Countdown from '../components/Countdown';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen">
      {/* Language Switcher - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
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
                  src="/realcore-logo.jpg"
                  alt="RealCore Group Logo"
                  width={220}
                  height={55}
                  className="h-14 w-auto"
                  priority
                />
              </div>
            </div>

            {/* Festive Banner */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-realcore-gold/10 border border-realcore-gold/30 mb-8">
              <Gift className="text-realcore-gold" size={20} />
              <span className="text-realcore-gold font-medium">{t('header.christmas')}</span>
              <Gift className="text-realcore-gold" size={20} />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 via-realcore-gold to-gray-800 bg-clip-text text-transparent">
                {t('header.title')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('header.subtitle')}
            </p>
            
            {/* CTA Button */}
            <a
              href="#formular"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gold-gradient text-realcore-primary font-semibold text-lg btn-gold shadow-lg hover:shadow-xl transition-all mb-8"
            >
              <Gift size={22} />
              {t('header.cta')}
            </a>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Users className="text-realcore-gold" size={18} />
                <span className="text-gray-600 text-sm">{t('header.everyEuroCounts')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Gift className="text-realcore-gold" size={18} />
                <span className="text-gray-600 text-sm">{t('header.totalPrizes')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Heart className="text-realcore-gold" size={18} />
                <span className="text-gray-600 text-sm">{t('header.partners')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Countdown Section */}
      <section className="max-w-2xl mx-auto px-4 -mt-4 mb-8 relative z-10">
        <Countdown />
      </section>

      {/* Message Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="card-gradient rounded-2xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
              {t('message.intro')}
            </p>

            <h2 className="text-2xl font-bold text-realcore-gold mb-4 flex items-center gap-2">
              <Star className="text-realcore-gold" size={24} />
              {t('message.howItWorks')}
            </h2>

            <ul className="text-lg leading-relaxed text-gray-700 mb-6 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-realcore-gold font-bold">1.</span>
                {t('message.step1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-realcore-gold font-bold">2.</span>
                {t('message.step2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-realcore-gold font-bold">3.</span>
                {t('message.step3')}
              </li>
            </ul>

            {/* Dankeschön Box */}
            <div className="danke-box rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('thanks.title')}</h3>
              <p className="text-lg text-gray-700">
                {t('thanks.text')}
              </p>
            </div>

            <p className="text-lg font-semibold text-realcore-gold mt-4">
              {t('thankyou.team')}
            </p>
          </div>
        </div>
      </section>

      {/* Charity Organizations Section */}
      <section className="max-w-6xl mx-auto px-4 py-12" id="spenden">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('partners.title')}
        </h2>
        <p className="text-lg text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          {t('partners.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Lichtblicke e.V. */}
          <div className="card-gradient rounded-2xl p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                <Image
                  src="https://lichtblicke.de/assets/uploads/logos/libli_logo_weit.png"
                  alt="Lichtblicke e.V. Logo"
                  width={160}
                  height={60}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{t('partners.lichtblicke.name')}</h3>
                <p className="text-gray-500">{t('partners.lichtblicke.desc')}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {t('partners.lichtblicke.text1')}
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              {t('partners.lichtblicke.text2')} <strong className="text-realcore-gold">{t('partners.lichtblicke.highlight')}</strong>
            </p>

            <a
              href="https://lichtblicke.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-realcore-gold hover:text-realcore-accent transition-colors font-medium"
            >
              {t('partners.learnMore')} <ExternalLink size={16} />
            </a>
          </div>

          {/* Diospi Suyana */}
          <div className="card-gradient rounded-2xl p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                <Image
                  src="https://www.diospi-suyana.de/wp-content/uploads/2020/02/Logo_DS_2020-c.png"
                  alt="Diospi Suyana Logo"
                  width={160}
                  height={60}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{t('partners.diospi.name')}</h3>
                <p className="text-gray-500">{t('partners.diospi.desc')}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {t('partners.diospi.text1')}
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              {t('partners.diospi.text2')} <strong className="text-realcore-gold">{t('partners.diospi.highlight')}</strong>
            </p>

            <a
              href="https://www.diospi-suyana.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-realcore-gold hover:text-yellow-300 transition-colors font-medium"
            >
              {t('partners.learnMore')} <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Prize Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="card-gradient rounded-2xl p-8 md:p-12 border-2 border-realcore-gold/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('prizes.title')}
            </h2>
            <p className="text-lg text-gray-500">
              {t('prizes.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="text-center p-6 rounded-xl bg-yellow-50 border border-yellow-200">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{t('prizes.first')}</div>
              <div className="text-3xl font-bold text-gray-800">5.000 €</div>
              <div className="text-gray-500 mt-1">{t('prizes.voucher')}</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-4xl font-bold text-gray-500 mb-2">{t('prizes.second')}</div>
              <div className="text-3xl font-bold text-gray-800">4.000 €</div>
              <div className="text-gray-500 mt-1">{t('prizes.voucher')}</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-4xl font-bold text-amber-700 mb-2">{t('prizes.third')}</div>
              <div className="text-3xl font-bold text-gray-800">3.000 €</div>
              <div className="text-gray-500 mt-1">TechHub Gutschein</div>
            </div>
          </div>

          {/* TechHub Info */}
          <div className="danke-box rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-realcore-gold">
              Der RealCore TechHub: Ihr Partner für Technologie-Integration
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Der RealCore TechHub dient als zentraler Marktplatz für unsere technologieübergreifenden Beratungs- und Implementierungsleistungen. Unser Ziel ist es, Sie mit fundierter Expertise bei der digitalen Transformation zu unterstützen.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
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
          <p className="text-lg text-gray-500">
            Wählen Sie Ihre Spendenorganisation und nehmen Sie am Gewinnspiel teil
          </p>
        </div>

        <DonationForm />
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {t('faq.title')}
          </h2>
          <p className="text-gray-500">{t('faq.subtitle')}</p>
        </div>
        
        <div className="space-y-4">
          <details className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-gray-800">{t('faq.q1')}</span>
              <span className="text-realcore-gold transition-transform group-open:rotate-180">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-gray-600">
              {t('faq.a1')}
            </div>
          </details>
          
          <details className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-gray-800">{t('faq.q2')}</span>
              <span className="text-realcore-gold transition-transform group-open:rotate-180">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-gray-600">
              {t('faq.a2')}
            </div>
          </details>
          
          <details className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-gray-800">{t('faq.q3')}</span>
              <span className="text-realcore-gold transition-transform group-open:rotate-180">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-gray-600">
              {t('faq.a3')}
            </div>
          </details>
          
          <details className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-gray-800">{t('faq.q4')}</span>
              <span className="text-realcore-gold transition-transform group-open:rotate-180">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-gray-600">
              {t('faq.a4')}
            </div>
          </details>
        </div>
      </section>

      {/* Back to Top Button */}
      <a
        href="#"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full gold-gradient shadow-lg flex items-center justify-center text-realcore-primary hover:scale-110 transition-transform z-40"
        aria-label="Nach oben"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </a>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/realcore-logo.jpg"
                alt="RealCore Group Logo"
                width={140}
                height={35}
                className="h-9 w-auto"
              />
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="/teilnahmebedingungen" className="hover:text-gray-800 transition-colors">
                {t('footer.terms')}
              </a>
              <a href="/datenschutz" className="hover:text-gray-800 transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="https://realcore.de" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                realcore.de
              </a>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-400">
            {t('footer.rights')}
          </div>
        </div>
      </footer>
    </main>
  );
}
