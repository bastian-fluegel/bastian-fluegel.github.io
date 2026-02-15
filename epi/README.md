# Epistulae - Sokratische Briefe

Eine zen-artige Progressive Web App mit 100 philosophischen Briefen des Sokrates aus dem heutigen Deutschland.

## ✨ Design-Philosophie

**Ruhe & Gelassenheit** - Inspiriert von Sokrates' Weisheit und zen-buddhistischer Ästhetik:
- Sanfte, erdige Farbpalette (Creme, Bronze, Stein)
- Elegante Typografie mit Crimson Text
- Minimalistisches, ablenkungsfreies Interface
- Subtile Animationen und Übergänge
- Pergament-ähnliche Textdarstellung

## 🎯 Features

✅ **Progressive Web App (PWA)**
- Installierbar auf Desktop & Mobil
- Offline-Funktionalität
- App-ähnliches Erlebnis
- Optimiert für Touch und Desktop

✅ **100 Philosophische Briefe**
- Sokrates reflektiert über das moderne Deutschland
- Interaktive Fragen mit durchdachten Antwortmöglichkeiten
- Personalisiertes Profil basierend auf deinen Antworten

✅ **Zen-Design**
- Edles, zeitloses Interface
- Fokus auf Lesbarkeit und Kontemplation
- Konsistente Designsprache über alle Ebenen
- Responsive für alle Bildschirmgrößen

## 📱 Installation

### Als PWA installieren:

1. **Desktop (Chrome/Edge):**
   - Öffne die App im Browser
   - Klicke auf das Install-Icon in der Adressleiste
   - Oder: Menü → "App installieren"

2. **Mobile (iOS Safari):**
   - Öffne die App in Safari
   - Tippe auf "Teilen"-Button
   - Wähle "Zum Home-Bildschirm"

3. **Mobile (Android Chrome):**
   - Öffne die App in Chrome
   - Tippe auf Menü (⋮)
   - Wähle "App installieren"

### Lokale Entwicklung:

```bash
# Mit dem mitgelieferten Startskript
./start.sh

# Oder manuell mit Python
python3 -m http.server 8000

# Oder mit Node.js
npx serve

# Dann öffnen: http://localhost:8000
```

## 🎨 Design-System

### Farbpalette
- **Zen Cream** `#f5f1e8` - Haupthintergrund
- **Zen Stone** `#3d3d3d` - Primärtext
- **Zen Bronze** `#8b7355` - Akzente & Interaktionen
- **Zen Gold** `#b8956a` - Highlights
- **Parchment** `#ebe6d9` - Inhaltshintergrund

### Typografie
- **Crimson Text** - Elegante Serif-Schrift für alle Texte
- Größen: 1.1rem (Body), 1.3rem (Titel), 1.05rem (Fragen)
- Zeilenhöhe: 1.8 für optimale Lesbarkeit

### Prinzipien
- **Weniger ist mehr** - Nur essenzielle Elemente
- **Subtile Interaktionen** - Sanfte Hover-Effekte & Übergänge
- **Atmende Layouts** - Großzügige Abstände
- **Respekt vor dem Text** - Content im Fokus

## 📂 Struktur

```
pwa/
├── index.html          # Hauptseite
├── style.css           # Zen-Styling
├── script.js           # App-Logik
├── letters.json        # 100 Briefe (JSON)
├── manifest.json       # PWA-Manifest
├── service-worker.js   # Offline-Support
├── icon.png            # App-Icon 512x512
├── icon-192.png        # App-Icon 192x192
├── favicon.png         # Favicon
├── start.sh            # Startskript
└── README.md           # Diese Datei
```

## 🛠 Technologien

- **Vanilla JavaScript** - Keine Frameworks, pure Performance
- **Service Worker** - Offline-Funktionalität
- **LocalStorage** - Persistente Daten
- **CSS3** - Moderne Animationen & Layouts
- **Google Fonts** - Crimson Text
- **Progressive Enhancement** - Funktioniert überall

## 🧘 Nutzung

1. Öffne die App
2. Lies den ersten Brief von Sokrates
3. Beantworte die philosophische Frage
4. Deine Antworten formen dein persönliches Profil
5. Entdecke alle 100 Briefe in deinem Tempo

## 🌟 Besonderheiten

- **Schreibanimation** - Briefe erscheinen Buchstabe für Buchstabe
- **Zufällige Anreden** - Persönliche Begrüßungen
- **Profile Reflexionen** - Deine Antworten werden reflektiert
- **Zen-Weisheiten** - Statt Werbung: philosophische Mantras
- **Responsive Design** - Perfekt auf allen Geräten

## 📖 Über das Projekt

Epistulae ist eine meditative Reise durch 100 Briefe, in denen Sokrates das moderne Deutschland beobachtet und hinterfragt. Jeder Brief behandelt zeitgenössische Themen aus philosophischer Perspektive und lädt zum Nachdenken ein.

Das Design vereint antike Weisheit mit zen-buddhistischer Ästhetik zu einer harmonischen digitalen Erfahrung.

---

*In Stille liegt Weisheit · In Fragen liegt Erkenntnis*
