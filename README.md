# RealCore Weihnachtsspende 2024

Eine festliche Landing Page für die RealCore Weihnachts-Spendenaktion mit integriertem Gewinnspiel.

## Funktionen

- 🎄 **Festliches Design** - Weihnachtliches Theme mit Schnee-Animation
- 💝 **Spendenwahl** - Auswahl zwischen Lichtblicke e.V. und Diospi Suyana
- 🎁 **Gewinnspiel** - Automatische Teilnahme mit TechHub Gutscheinen
- 📧 **E-Mail Benachrichtigung** - Submissions werden an events@realcore.de gesendet
- ✅ **DSGVO-konform** - Mit Datenschutzhinweisen und Teilnahmebedingungen

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **E-Mail**: Nodemailer

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Produktion

```bash
npm run build
npm start
```

## Deployment auf Render

Das Projekt enthält ein `render.yaml` Blueprint für einfaches Deployment:

1. **Repository auf GitHub/GitLab pushen**
2. **Auf Render.com gehen** → "New" → "Blueprint"
3. **Repository verbinden** und `render.yaml` wird automatisch erkannt
4. **Environment Variables** in Render Dashboard setzen (SMTP-Konfiguration)
5. **Deploy starten**

Das Blueprint konfiguriert:
- **Region**: Frankfurt (EU)
- **Plan**: Free tier
- **Auto-Deploy**: Bei jedem Push aktiviert
- **Health Check**: Auf `/` konfiguriert

## E-Mail Konfiguration

Für den E-Mail-Versand müssen folgende Umgebungsvariablen gesetzt werden:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_FROM=noreply@realcore.de
```

Erstellen Sie eine `.env.local` Datei mit diesen Werten für die lokale Entwicklung.

**Hinweis**: Ohne SMTP-Konfiguration werden Submissions in der Konsole geloggt.

## Seiten

| Pfad | Beschreibung |
|------|--------------|
| `/` | Hauptseite mit Spendenwahl und Formular |
| `/danke` | Bestätigungsseite nach erfolgreicher Teilnahme |
| `/teilnahmebedingungen` | Gewinnspiel-Teilnahmebedingungen |
| `/datenschutz` | Datenschutzhinweise |

## Projekt-Struktur

```
src/
├── app/
│   ├── api/
│   │   └── submit/
│   │       └── route.ts    # API für Formular-Submission
│   ├── danke/
│   │   └── page.tsx        # Danke-Seite
│   ├── datenschutz/
│   │   └── page.tsx        # Datenschutzhinweise
│   ├── teilnahmebedingungen/
│   │   └── page.tsx        # Teilnahmebedingungen
│   ├── globals.css         # Globale Styles
│   ├── layout.tsx          # Root Layout
│   └── page.tsx            # Hauptseite
└── components/
    └── DonationForm.tsx    # Spenden-Formular Komponente
```

## Anpassungen

### Teilnahmebedingungen
Die Teilnahmebedingungen können in `/src/app/teilnahmebedingungen/page.tsx` angepasst werden.

### Datenschutzhinweise
Die Datenschutzhinweise können in `/src/app/datenschutz/page.tsx` angepasst werden.
(Hinweis: Die vollständigen Datenschutzhinweise müssen noch ergänzt werden)

### Gewinnspiel-Ende
Das Gewinnspiel-Ende ist aktuell auf 31.12.2024 gesetzt. Dies kann in den Teilnahmebedingungen geändert werden.

## Lizenz

© 2024 RealCore Group GmbH. Alle Rechte vorbehalten.
