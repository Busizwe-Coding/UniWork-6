# Moori Sushi – Android app (Kotlin, Jetpack Compose)

* Min SDK 24 (Android 7.0), Kotlin DSL (`build.gradle.kts`), Jetpack Compose + Material 3
* Same server and database as the website: the `buzz` admin, customer accounts, Google SSO, menu and orders

## Run it
1. Start the website server on your computer (`npm run dev`, port 3000) – use the updated `server.ts` from this delivery (it adds `/api/menu`).
2. In Android Studio: **File > Open** this folder, let Gradle sync (accept any prompt to download the Gradle wrapper / SDK 35).
3. Run on an emulator. The debug build talks to `http://10.0.2.2:3000` (= your computer from inside the emulator).
   * Real phone on the same Wi-Fi: change the debug `BASE_URL` in `app/build.gradle.kts` to `http://<your-computer-LAN-IP>:3000` and add that IP to `app/src/main/res/xml/network_security_config.xml`.
   * Release build uses `https://moorisushi.co.za` (edit `BASE_URL` in the `release` block).

## Logins
* Admin: `buzz@email.com` / `buzzbee` (sees the Kitchen KDS tab)
* Customers: "Create account" on the first screen

## Google SSO (one-time setup, in Google Cloud Console, same project as the website)
1. Website: create a **Web application** OAuth client and put its ID in the server's `.env` as `GOOGLE_CLIENT_ID=` (the app reads this ID from the server automatically).
2. Android: create an **Android** OAuth client with package name `com.moori.sushi` and your debug keystore SHA-1
   (Android Studio: Gradle panel > app > Tasks > android > signingReport).
3. Add your Google account as a test user on the OAuth consent screen while it is in "Testing".

## Light / dark mode
Settings tab > Appearance: Follow system / Light / Dark (remembered between launches).
