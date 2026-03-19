# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - heading "State Machine Test" [level=1] [ref=e3]
    - generic [ref=e4]:
      - generic [ref=e5]: 🔔
      - heading "alerting" [level=2] [ref=e6]
      - paragraph [ref=e7]: "Index: 2 / 5"
    - generic [ref=e8]:
      - generic [ref=e9]:
        - paragraph [ref=e10]: "Verlauf:"
        - paragraph [ref=e11]: idle → calling → alerting
      - generic [ref=e12]:
        - generic [ref=e13]: "Kann zurückgehen: Ja"
        - generic [ref=e14]: "Kann vorwärts: Ja"
    - generic [ref=e15]:
      - button "← Zurück" [ref=e16]
      - button "Weiter →" [active] [ref=e17]
    - generic [ref=e18]:
      - button "Überspringen" [ref=e19]
      - button "Reset" [ref=e20]
    - generic [ref=e21]:
      - heading "Direktwahl:" [level=3] [ref=e22]
      - generic [ref=e23]:
        - button "idle" [ref=e24]
        - button "calling" [ref=e25]
        - button "alerting" [ref=e26]
        - button "deploying" [ref=e27]
        - button "arriving" [ref=e28]
        - button "returning" [ref=e29]
    - generic [ref=e30]:
      - generic [ref=e31]: Automatisch weiter
      - checkbox "Automatisch weiter" [ref=e32]
  - button "Open Next.js Dev Tools" [ref=e38] [cursor=pointer]:
    - img [ref=e39]
  - alert [ref=e42]
```