import { Heart, CheckCircle2, Gift, Star, TreePine, Sparkles, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 animate-float opacity-30">
        <TreePine size={48} className="text-realcore-gold" />
      </div>
      <div className="fixed top-20 right-20 animate-float opacity-30" style={{ animationDelay: '1s' }}>
        <Star size={32} className="text-realcore-gold" />
      </div>
      <div className="fixed bottom-20 left-1/4 animate-sparkle opacity-30">
        <Sparkles size={24} className="text-realcore-gold" />
      </div>
      <div className="fixed bottom-10 right-1/4 animate-float opacity-30" style={{ animationDelay: '2s' }}>
        <Gift size={36} className="text-realcore-gold" />
      </div>

      <div className="max-w-2xl w-full">
        <div className="card-gradient rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full gold-gradient flex items-center justify-center animate-float">
              <CheckCircle2 className="text-realcore-primary" size={48} />
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-realcore-gold to-white bg-clip-text text-transparent">
              Vielen Dank für Ihre Teilnahme!
            </span>
          </h1>

          <p className="text-xl text-white/80 mb-6">
            Ihre Spendenwahl wurde erfolgreich übermittelt.
          </p>

          <div className="bg-white/10 rounded-xl p-6 mb-8 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="text-realcore-gold" size={24} />
              <span className="text-lg font-semibold text-realcore-gold">
                Sie nehmen nun am Gewinnspiel teil!
              </span>
            </div>
            <p className="text-white/70">
              Wir werden die Gewinner per E-Mail benachrichtigen. 
              Viel Glück beim Gewinnspiel!
            </p>
          </div>

          <div className="space-y-4 text-left bg-white/5 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-realcore-gold flex items-center gap-2">
              <Heart size={20} />
              Was passiert jetzt?
            </h2>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <span className="text-realcore-gold font-bold">1.</span>
                <span>Ihre Spendenwahl wird an RealCore übermittelt.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-realcore-gold font-bold">2.</span>
                <span>RealCore spendet den Betrag an Ihre gewählte Organisation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-realcore-gold font-bold">3.</span>
                <span>Die Gewinner des Gewinnspiels werden nach Ablauf der Teilnahmefrist per E-Mail informiert.</span>
              </li>
            </ul>
          </div>

          <p className="text-lg text-white/90 mb-8">
            Wir wünschen Ihnen und Ihrer Familie eine frohe und besinnliche Weihnachtszeit.
          </p>

          <p className="text-realcore-gold font-semibold mb-8">
            Ihr Team von der RealCore Group GmbH
          </p>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <Home size={20} />
            Zurück zur Startseite
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              src="https://realcore.info/bilder/rc-logo.png"
              alt="RealCore Group Logo"
              width={120}
              height={36}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-sm text-white/40">
            © 2025 RealCore Group GmbH. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </main>
  );
}
