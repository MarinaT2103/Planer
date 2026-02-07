# GitHub Actions для автоматической сборки Android APK

Этот проект настроен для автоматической сборки Android APK через GitHub Actions.

## Как это работает

При каждом push в ветку `main`:
1. GitHub Actions автоматически запускает сборку
2. Компилируется Android приложение
3. APK подписывается тестовым ключом
4. Создаётся новый релиз с APK файлом
5. APK доступен для скачивания в разделе Releases

## Где скачать APK

### Вариант 1: Releases
Перейдите на: https://github.com/MarinaT2103/Planer/releases

Там будут автоматически создаваться релизы с APK файлами.

### Вариант 2: Artifacts
1. Перейдите в: https://github.com/MarinaT2103/Planer/actions
2. Выберите последний успешный workflow
3. Внизу страницы найдите "Artifacts"
4. Скачайте `planner-release-apk`

## Ручной запуск сборки

1. Перейдите на: https://github.com/MarinaT2103/Planer/actions
2. Выберите "Build Android APK"
3. Нажмите "Run workflow"
4. Выберите ветку `main`
5. Нажмите "Run workflow" ещё раз

## Установка собранного APK

### На устройстве:
1. Скачайте APK файл из Releases
2. Откройте файл на Android устройстве
3. Разрешите установку из неизвестных источников (если попросит)
4. Установите приложение
5. Откройте приложение и введите PIN: **1590**

### Через ADB:
```bash
adb install app-release-signed.apk
```

## Требования

- **Android 12** (API 31) или выше
- Около 10 МБ свободного места

## Автоматизация

GitHub Actions автоматически:
- ✅ Проверяет код
- ✅ Устанавливает Java JDK 17
- ✅ Собирает APK
- ✅ Подписывает APK
- ✅ Создаёт Release
- ✅ Загружает APK в Artifacts

## Время сборки

Обычно занимает 3-5 минут.

## Статус сборки

![Build Status](https://github.com/MarinaT2103/Planer/actions/workflows/android-build.yml/badge.svg)

## Примечания

- **Тестовая подпись**: APK подписан автоматически созданным ключом для тестирования
- **Production**: Для публикации в Google Play нужен собственный keystore
- **Безопасность**: Не храните production ключи в репозитории!

## Для production релизов

Если хотите подписывать APK своим ключом:

1. Создайте keystore:
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias planner
```

2. Закодируйте в base64:
```bash
base64 release-key.jks > release-key-base64.txt
```

3. Добавьте secrets в GitHub:
   - Settings → Secrets → New repository secret
   - `KEYSTORE_FILE`: содержимое release-key-base64.txt
   - `KEYSTORE_PASSWORD`: пароль от keystore
   - `KEY_ALIAS`: alias ключа
   - `KEY_PASSWORD`: пароль ключа

4. Обновите workflow для использования secrets

## Ссылки

- **Репозиторий**: https://github.com/MarinaT2103/Planer
- **Actions**: https://github.com/MarinaT2103/Planer/actions
- **Releases**: https://github.com/MarinaT2103/Planer/releases

## Поддержка

При возникновении проблем со сборкой:
1. Проверьте логи в Actions
2. Убедитесь, что все файлы добавлены в git
3. Проверьте права доступа на gradlew

## Лицензия

MIT
