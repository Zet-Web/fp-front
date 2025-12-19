# Инструкция по деплою

## Процесс деплоя

### 1. Локальная сборка (перед деплоем)

Для полной сборки основного приложения + микрофронта:

```bash
npm run build:full
```

Это выполнит:
1. `build:network-mfe` - соберет микрофронт и скопирует в `public/assets/network/`
2. `build` - соберет основное приложение (включая микрофронт из `public/assets/network/`)

**Результат:** папка `dist/` с готовым к деплою приложением.

### 2. Что происходит при сборке

#### `npm run build:network-mfe`
- Устанавливает зависимости микрофронта
- Собирает микрофронт (`network-mfe/dist/`)
- Копирует собранные файлы в `public/assets/network/`

#### `npm run build`
- Собирает основное приложение
- Копирует `public/assets/network/` в `dist/assets/network/`
- Создает финальный билд в `dist/`

### 3. Деплой на сервер

После сборки нужно задеплоить папку `dist/` на ваш сервер.

#### Вариант A: Простой деплой (FTP/SSH)

```bash
# 1. Соберите проект
npm run build:full

# 2. Загрузите dist/ на сервер
# Например, через scp:
scp -r dist/* user@server:/path/to/web/root/

# Или через rsync:
rsync -avz dist/ user@server:/path/to/web/root/
```

#### Вариант B: CI/CD (GitHub Actions, GitLab CI, etc.)

Пример для GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build network microfrontend
        run: npm run build:network-mfe
      
      - name: Build main application
        run: npm run build
      
      - name: Deploy to server
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
```

#### Вариант C: Docker

Если используете Docker, создайте `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем код
COPY . .

# Собираем микрофронт
RUN npm run build:network-mfe

# Собираем основное приложение
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Важные моменты

1. **Переменные окружения**: Убедитесь, что на сервере настроены правильные переменные окружения для production
2. **Пути**: Микрофронт должен быть доступен по пути `/assets/network/network.js`
3. **CORS**: Настройте CORS на backend для production домена
4. **Кэширование**: Настройте кэширование статических файлов (`.js`, `.css`)

### 5. Проверка после деплоя

1. Откройте сайт в браузере
2. Перейдите на `/network`
3. Откройте DevTools → Network
4. Проверьте, что `/assets/network/network.js` загружается (статус 200)
5. Проверьте, что микрофронт рендерится без ошибок

## Отдельный деплой микрофронта

Если микрофронт в отдельном репозитории, можно деплоить его отдельно:

```bash
cd network-mfe
npm install
npm run build
# Затем загрузите dist/ на CDN или в public/assets/network/ основного проекта
```

Но обычно проще использовать `build:full` в основном проекте.

