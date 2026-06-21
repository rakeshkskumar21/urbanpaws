# Assets folder

`app.config.ts` references these files, which are not included in this code drop
(binary image assets aren't generated here):

- icon.png            (1024x1024, app icon)
- splash.png          (splash screen image)
- adaptive-icon.png   (1024x1024, Android adaptive icon foreground)
- favicon.png         (web favicon)

Add your own Urban Paws logo files here before running `eas build`, or
generate placeholders with:

  npx expo-asset-generator   (community tool)

or simply drop any square PNG in here with these filenames — Expo will
accept them for local development (`expo start`) without issue. They're
only strictly required for store builds.
