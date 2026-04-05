# 🏨 HotelHub - Система бронювання готельних номерів

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**HotelHub** — це комплексний Fullstack веб-додаток, розроблений у рамках дипломного проєкту. Платформа дозволяє клієнтам зручно знаходити та бронювати номери, а персоналу готелю — керувати бронюваннями в режимі реального часу.

## ✨ Ключові можливості

### 🧑‍💻 Для гостей (GUEST)
- **Розумний пошук:** Фільтрація вільних номерів за датами (з перевіркою перетинів у БД), ціною та кількістю гостей.
- **Бронювання та оплата:** Створення бронювань з автоматичним підрахунком вартості та імітацією еквайрингу.
- **Особистий кабінет:** Відстеження статусів своїх бронювань (`PENDING`, `CONFIRMED`, `COMPLETED` тощо).
- **Відгуки:** Можливість залишити рейтинг та коментар лише після фактичного проживання у номері.

### 👔 Для персоналу (ADMIN / MANAGER)
- **Real-time управління:** Миттєве відображення нових бронювань та оплат без перезавантаження сторінки завдяки **WebSockets**.
- **Керування статусами:** Зміна статусу бронювання клієнта в один клік.

---

## 🛠 Технологічний стек та Архітектура

### Frontend
- **Бібліотеки:** React 18, TypeScript, Tailwind CSS, Lucide React (іконки).
- **Стейт-менеджмент:** Zustand (глобальний стан), React Query (кешування та серверний стан).
- **Маршрутизація та Форми:** React Router v6, React Hook Form.
- **Архітектура:** Проєкт побудовано за сучасною методологією **Feature-Sliced Design (FSD)**, що забезпечує високу масштабованість та незалежність модулів (entities, features, widgets, pages).

### Backend
- **Ядро:** Node.js, Express.js.
- **База даних:** PostgreSQL (основне сховище) + **Prisma ORM**.
- **Кешування:** **Redis** (оптимізація запитів до каталогу кімнат).
- **Real-time:** Socket.io (WebSockets).
- **Безпека:** JWT-авторизація, Helmet, Rate Limiting (захист від DDoS), строга валідація ролей.
- **Паттерни проєктування:** Service Layer, Strategy (для обробки платежів), Observer (для системи сповіщень).

### Інфраструктура
- **Контейнеризація:** Docker та Docker Compose (повна ізоляція мікросервісів).
- **Сховище медіа:** Cloudinary API.

---

## 🚀 Швидкий старт (через Docker)

Проєкт повністю контейнеризований і готовий до розгортання однією командою.

### 1. Клонування репозиторію
```bash
git clone https://github.com/your-username/HotelHub.git
cd HotelHub
```

### 2. Налаштування змінних оточення
Створіть файл `.env` у корені проєкту (там де знаходиться `docker-compose.yml`) та додайте ключі:
```env
# Змінні для Docker (вже налаштовані у docker-compose.yml)
DATABASE_URL="postgresql://postgres:mysecretpassword@postgres:5432/hotelhub?schema=public"
REDIS_URL="redis://redis:6379"
JWT_SECRET="your_super_secret_key"
PORT=5000

# Cloudinary (додайте свої ключі)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Запуск проєкту
Переконайтеся, що у вас встановлений Docker та Docker Compose, і виконайте команду в корені проєкту:
```bash
docker-compose up --build
```

### 4. Доступ до сервісів
- 🌐 **Frontend (Клієнтський додаток):** `http://localhost:5173`
- ⚙️ **Backend API:** `http://localhost:5000/api`
- 📚 **Swagger Документація API:** `http://localhost:5000/api-docs`

---

## 📸 Скріншоти

*(Створіть папку `screenshots` у корені, завантажте туди фото і розкоментуйте рядки нижче)*

---

## 📜 Ліцензія
Цей проєкт створено в навчальних цілях як дипломну роботу. Всі права захищені. © 2026.