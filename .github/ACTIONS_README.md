# GitHub Actions — сборка Android APK

Автоматическая сборка **офлайн-версии** планировщика для Android 12+. Веб-приложение встраивается в APK и работает без интернета.

## Как это работает

При каждом push в ветку `main`:
1. Собирается веб-приложение (`npm run build`)
2. Контент копируется в Android assets
3. Компилируется Android приложение
4. APK подписывается (v2 + v3)
5. Артефакт доступен 30 дней

## Где скачать APK

### Artifacts (основной способ)

1. Перейдите: **[https://github.com/MarinaT2103/Planer/actions](https://github.com/MarinaT2103/Planer/actions)**
2. Выберите последнюю успешную сборку (зелёная галочка)
3. Прокрутите вниз до **Artifacts**
4. Скачайте **planner-release-apk**
5. Распакуйте ZIP → установите `app-release-signed.apk`

### Ручной запуск

1. [Actions](https://github.com/MarinaT2103/Planer/actions) → **Build Android APK**
2. **Run workflow** → **Run workflow**
3. Дождитесь завершения (~3–5 мин)

## Требования

- Android 12 (API 31) или выше
- PIN-код: **1590**

## Ссылки

- [Репозиторий](https://github.com/MarinaT2103/Planer)
- [Actions](https://github.com/MarinaT2103/Planer/actions)
- [Releases](https://github.com/MarinaT2103/Planer/releases)
