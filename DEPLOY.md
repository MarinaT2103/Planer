# Netlify Deployment Guide

## Автоматический деплой

1. Зайдите на https://app.netlify.com/
2. Нажмите "Add new site" → "Import an existing project"
3. Выберите "Deploy with GitHub"
4. Авторизуйтесь и выберите репозиторий `MarinaT2103/Planer`
5. Настройки уже готовы в `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Нажмите "Deploy site"

## После деплоя

1. Netlify даст вам URL типа: `https://your-app-name.netlify.app`
2. Обновите файл `android-app/app/src/main/java/com/planner/app/MainActivity.kt`
3. Замените строку 44 на ваш URL:
   ```kotlin
   webView.loadUrl("https://your-app-name.netlify.app")
   ```
4. Сделайте commit и push - GitHub Actions пересоберет APK

## Готово! 🚀
