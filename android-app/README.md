# Android приложение "Планировщик"

Android приложение на базе WebView для Android 12 и выше.

## Требования

- Android Studio Hedgehog | 2023.1.1 или новее
- Android SDK 31+ (Android 12)
- Java Development Kit (JDK) 11 или новее

## Установка Android Studio

### Ubuntu/Linux:

```bash
# Скачайте Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.28/android-studio-2023.1.1.28-linux.tar.gz

# Распакуйте
tar -xvzf android-studio-2023.1.1.28-linux.tar.gz
sudo mv android-studio /opt/

# Запустите
/opt/android-studio/bin/studio.sh
```

## Сборка APK

### Способ 1: Android Studio (рекомендуется)

1. **Откройте проект:**
   - Запустите Android Studio
   - File → Open
   - Выберите папку `android-app`

2. **Настройте SDK:**
   - Tools → SDK Manager
   - Установите Android SDK 31 (Android 12) и выше

3. **Измените URL:**
   - Откройте `app/src/main/java/com/planner/app/MainActivity.kt`
   - Замените `"https://your-app.netlify.app"` на URL вашего деплоя

4. **Соберите APK:**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK будет в `app/build/outputs/apk/release/`

### Способ 2: Командная строка

```bash
cd android-app

# Linux/Mac
./gradlew assembleRelease

# Windows
gradlew.bat assembleRelease
```

APK будет в `app/build/outputs/apk/release/app-release-unsigned.apk`

## Подписание APK

Для установки на устройство нужно подписать APK:

```bash
# Создайте keystore
keytool -genkey -v -keystore planner-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias planner

# Подпишите APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore planner-release-key.jks app-release-unsigned.apk planner

# Оптимизируйте (zipalign)
zipalign -v 4 app-release-unsigned.apk planner-release.apk
```

## Установка на устройство

### Через ADB:

```bash
# Включите "Отладку по USB" на устройстве
adb install app-release.apk
```

### Через файл:

1. Скопируйте APK на устройство
2. Откройте файловый менеджер
3. Нажмите на APK файл
4. Разрешите установку из неизвестных источников

## Тестирование

### На эмуляторе:

1. Tools → Device Manager
2. Create Device
3. Выберите устройство с Android 12+
4. Run → Run 'app'

### На реальном устройстве:

1. Включите "Режим разработчика"
2. Включите "Отладку по USB"
3. Подключите устройство
4. Run → Run 'app'

## Настройка для production

### 1. Измените URL в MainActivity.kt:

```kotlin
// Замените на ваш Netlify URL
webView.loadUrl("https://your-app.netlify.app")
```

### 2. Обновите данные приложения:

- **Имя:** `app/src/main/res/values/strings.xml`
- **Иконка:** Добавьте в `app/src/main/res/mipmap-*`
- **ID:** `app/build.gradle` → `applicationId`

### 3. Добавьте иконку:

Создайте иконки для всех размеров:
- mipmap-mdpi: 48x48
- mipmap-hdpi: 72x72
- mipmap-xhdpi: 96x96
- mipmap-xxhdpi: 144x144
- mipmap-xxxhdpi: 192x192

Используйте: https://romannurik.github.io/AndroidAssetStudio/

## Публикация в Google Play

1. Создайте аккаунт разработчика ($25)
2. Подготовьте материалы:
   - Иконка 512x512
   - Feature Graphic 1024x500
   - Скриншоты (минимум 2)
   - Описание приложения
3. Создайте новое приложение в Google Play Console
4. Загрузите подписанный APK или AAB
5. Заполните все обязательные поля
6. Отправьте на модерацию

## Возможности приложения

✅ **Offline работа** — IndexedDB
✅ **Push уведомления** — Web Notifications API
✅ **Защита паролем** — PIN: 1590
✅ **Адаптивный дизайн** — mobile-first
✅ **Темная тема** — автоматическая
✅ **Быстрая загрузка** — Service Worker

## Поддерживаемые версии

- Android 12 (API 31)+
- Рекомендуется: Android 13+

## Отладка

Для просмотра логов WebView:

```bash
adb logcat | grep chromium
```

Для remote debugging:
1. chrome://inspect в Chrome на компьютере
2. Подключите устройство по USB
3. Откройте WebView в списке

## Лицензия

MIT
