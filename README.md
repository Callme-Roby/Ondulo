# Ondulo

Ondulo est une app de bien-être pensée pour les personnes qui vivent seules. On y prend soin de soi au quotidien avec **Billy**, un petit blob animé qui ondule, grandit et reprend des couleurs à mesure que les missions du jour (bouger, se laver, bien manger) sont accomplies.

Tout reste sur l'appareil : aucun compte, aucun serveur. La progression est enregistrée localement (`localStorage` sur le web, stockage natif sur mobile).

## Captures

| Web (desktop) | Web (mobile) |
| --- | --- |
| <img src="docs/screenshots/web-desktop.png" alt="Ondulo dans un cadre de téléphone centré sur desktop" width="480"> | <img src="docs/screenshots/web-mobile.png" alt="Ondulo en plein écran sur mobile" width="220"> |

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
src/screens/             Accueil, Mini Moi, Boutique, Amis
src/storage/             persistance locale de la progression
src/constants/           thème et missions du jour
public/index.html        page HTML de la version web
```
