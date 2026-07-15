# CV Libre

Plateforme open source et **gratuite** pour créer un CV professionnel, conforme aux
normes ATS (Applicant Tracking System), sans compte requis. Projet initié par
**Éditions Cypher**.

## Fonctionnalités (MVP)

- Wizard en 6 étapes : norme, infos perso, expérience, formation, compétences/langues, export
- 2 modèles : ATS Classique (sobre, optimisé parsing) et Moderne (sidebar, plus visuel)
- 3 normes de CV : France/Europe, International (US/UK), Afrique de l'Ouest
- Preview live pendant la saisie
- Score qualité en temps réel (verbes d'action, réalisations chiffrées, complétude)
- Export PDF (texte sélectionnable, pas d'image — lisible par les ATS)
- Export texte brut (pour coller dans un formulaire de candidature)
- Export JSON (portabilité des données, réutilisable ailleurs)
- Sauvegarde automatique en local (localStorage) — aucune donnée envoyée à un serveur

## Stack technique

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand (état + persistance locale)
- `@react-pdf/renderer` pour la génération du PDF côté client

## Installation

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000

## Structure du projet

```
src/
  app/                    Pages Next.js (App Router)
  components/
    wizard/               Les 6 étapes du formulaire
    templates/             Modèles de CV (rendu HTML pour la preview)
    pdf/                   Modèle de CV pour l'export PDF (react-pdf)
    preview/                Switch entre les modèles pour la preview live
  lib/
    store.ts               État global (Zustand + persistance locale)
    scoring.ts              Logique du score qualité
    export.ts                Export texte brut / JSON
  types/
    cv.ts                    Modèle de données du CV
```

## Pourquoi c'est compatible ATS

- Aucune mise en page en tableaux ou en position absolute qui casserait le parsing automatique.
- Texte toujours réel (jamais une image contenant du texte).
- Sections nommées de façon standard (Expérience, Formation, Compétences...).
- Export PDF avec texte sélectionnable garanti (via @react-pdf/renderer, pas une capture d'écran).

## Roadmap (V2)

- [ ] Comptes utilisateurs + sauvegarde cloud multi-CV
- [ ] Suggestions IA pour reformuler les réalisations (API Mistral/Claude)
- [ ] Lettre de motivation liée au CV
- [ ] Matching mots-clés avec une offre d'emploi collée
- [ ] Templates communautaires (soumission + modération)
- [ ] Import depuis un CV existant (PDF/LinkedIn)

## Licence

AGPL-3.0 — voir LICENSE. Toute modification déployée en tant que service doit
reverser ses améliorations à la communauté.

## Contribuer

Les PR sont bienvenues, notamment pour de nouveaux modèles de CV ou de
nouvelles normes régionales. Merci de garder les modèles compatibles ATS
(pas de mise en page en tableaux, texte réel uniquement).
