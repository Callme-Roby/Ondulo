# Ondulo

Ondulo est une app de bien-être pensée pour les personnes qui vivent seules. On y prend soin de soi au quotidien avec **Billy**, un petit blob animé qui ondule, grandit et reprend des couleurs à mesure que les missions du jour (bouger, se laver, bien manger) sont accomplies.

Au premier lancement, Billy fait connaissance au fil d'une courte conversation : ton prénom, ton humeur du moment, ce qui te ferait du bien. On peut la passer, ou la revoir plus tard depuis le bouton réglages de l'Accueil.

Tout reste sur l'appareil : aucun compte, aucun serveur. La progression est enregistrée localement (`localStorage` sur le web, stockage natif sur mobile).

## Captures

| Web (desktop) | Onboarding (mobile) | Accueil (mobile) |
| --- | --- | --- |
| <img src="docs/screenshots/web-desktop.png" alt="Ondulo dans un cadre de téléphone centré sur desktop" width="420"> | <img src="docs/screenshots/web-onboarding.png" alt="Conversation d'accueil avec Billy" width="200"> | <img src="docs/screenshots/web-mobile.png" alt="Écran d'accueil avec Billy et les missions du jour" width="200"> |

## Stack

- [Expo](https://expo.dev) SDK 54 / React Native 0.81, un seul code pour iOS, Android et le web (`react-native-web`)
- Animations du blob avec `react-native-reanimated`, visuels en `react-native-svg` et `expo-linear-gradient`
- Navigation par onglets avec React Navigation

## Lancer en local

Prérequis : Node.js 20 ou plus.

```bash
npm install
npm run web        # version web sur http://localhost:8081
npm start          # mobile : scanner le QR code avec Expo Go
```

Sur un écran large, l'app s'affiche dans un cadre de téléphone centré. En dessous de 600 px de large (mobile, iframe étroite), elle occupe tout l'écran.

## Build web

```bash
npm run build:web  # génère le site statique dans dist/
npx serve -s dist  # pour tester le build
```

## Déploiement

Le site est déployé sur [Vercel](https://vercel.com) à chaque push. La configuration est dans `vercel.json` : build `npm run build:web`, dossier de sortie `dist`, et réécriture de toutes les routes vers `index.html` (SPA).

L'APK Android est construit par le workflow GitHub Actions `.github/workflows/build-apk.yml`.

## Structure

```
App.tsx                  navigation par onglets
src/components/          Blob, cartes de mission, barre d'onglets, cadre web
src/screens/             Onboarding, Accueil, Mini Moi, Boutique, Amis
src/storage/             persistance locale (profil, progression)
src/constants/           thème, missions du jour, script de la conversation
public/index.html        page HTML de la version web
```
