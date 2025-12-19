# Network Microfrontend

Микрофронтенд для страницы Network (Контакты) основного приложения.

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

Собранные файлы будут в папке `dist/`. Для использования в основном приложении скопируйте содержимое `dist/` в `public/assets/network/` основного проекта.

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:3000
VITE_STORAGE_URL=https://s3.twcstorage.ru/0e561111-fps/
```

## Интеграция

Микрофронт монтируется в контейнер `#fp-network-root` на странице `/network` основного приложения.

## Структура

- `src/NetworkApp.tsx` - главный компонент приложения
- `src/network/` - логика страницы Network
- `src/components/ui/` - UI компоненты
- `src/lib/` - утилиты и API клиент

