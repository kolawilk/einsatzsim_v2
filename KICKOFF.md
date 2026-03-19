---

🚀 Projekt-Kickoff Template
Projektname: Einsatzsim v2

---

Projekt-Übersicht
Was ist das Problem, was gelöst werden soll?
Ich möchte das Spielen von Einsätzen z. B. mit der Playmobil Feuerwache mit meinem Sohn ein bisschen cooler und athmosphärischer machen.

Wer sind die Nutzer?
Papas und Mamas zusammen mit ihren Kindern.

Was ist das MVP?

- Web-App, optimiert für iPad+iPhone mit AlwaysOn-Funktion
- Eine StateMachine, die verschiedene Phasen der Einsätze abbildet: calling, alerting, deploying, arriving, returning
- Missionen sind in einer YAML definiert, das Format steht bereits fest.
- In jedem State werden Audiodateien-abgespielt. Audio-Definition:
 - sound_in: Wird direkt nach dem Wechsel in den State abgespielt
 - sound_floor: eine oder mehrere Audiodateien, die den Klangteppich der Szene bilden: überlagernd, im Loop ohne unterbrechnung.
 - sound_random: Ergänzt den Klangteppich um eine Liste aus Sounds, die zufällig abgespielt werden (kann z.B. eine Audiodatei eines kurzen Miau sein)
 - sound_sequence: Liste an Audiodateien, die sequentiell abgespielt werden
 - sound_out: Wenn der Wechsel in den nächsten State getriggert wurde, wird zuerst dieser sound abgespielt, dann wechselt der State.
- In jedem State wird ein Bild in 100 % Viewport angezeigt, fit: cover
- Es gibt einen Idle state: Ein Bild wird in 100 % Viewport angezeigt, fit: cover. Dienst als Start-State wenn die Seite aufgerufen wird und als State nach returning
- Gestartete Missionen können abgebrochen werden
- Settings können aufgerufen werden
- Es kann in den Settings eingestellt werden, dass ein halbautomatischer Ablauf stattfindet:
 - idle -> calling: Buttonklick
 - calling -> alerting: Automatisch
 - alerting -> deploying: Automatisch
 - deploying -> arriving: Buttonklick
 - arriving -> returning: Buttonklick
 - returning -> idle: Buttonklick
 - Automatische Wechsel warten, bis die Sequenz im aktuellen State abgelaufen ist. 
- Missions wiederholen sich nicht während einer Session


Was kommt später?

- Transfer zur iOS App mit Listing im AppStore


---

Technische Anforderungen
Hard-Requirements

Muss auf dem iPad laufen: Für Safari und Chrome optimiert
AlwaysOn
Möglichst wenig Energieverbrauch trotz AlwaysOn

Tech-Stack Präferenzen

UI Dialoge (aktuell nur Settings) bitte mit shadcn/ui Komponenten bauen.

---

Design & UX
Look & Feel

Es soll Kleinkind-freundlich aussehen. Schönes Feuerwehrrot. Der State Button ist mittig, groß, rund und mit Emojis z. B. Feuerwehrauto, je nach State.
Die angesprochenen ganzflächigen Bilder, werden aussehen wie aus Kinderbüchern z. B. tiptoi. Die ergänze ich später.


Mobile-first?
Ja, optimiert für iPads, iPhones


Dark Mode?
Irrelevant


---
Priorisierung
Must-Have (für MVP)
MVP ist oben definiert.

Should-Have (kurz nach MVP)


Nice-to-Have (später)
iOS App

---

Sonstiges
Risiken
<!-- Was könnte schiefgehen? -->
Abhängigkeiten
<!-- Externe APIs, Genehmigungen, andere Teams -->


Kommunikation


---

✅ Checkliste für Agent
Nachdem du dieses Template ausgefüllt hast:

[ ] Agent liest SOUL.md + USER.md
[ ] Agent erstellt Projektstruktur inkl. GitHub Repo
[ ] Agent speichert diese Datei als KICKOFF.md im Projekt-Root (darf nicht ins Repo!)
[ ] Agent liest README.md und erweitert um Vision
[ ] Agent erstellt docs/architecture.md
[ ] Agent erstellt Backlog in tasks/
[ ] Agent startet den Lobster-Flow für die ersten Tasks

---

Bereit zum Start? 🚀

---
