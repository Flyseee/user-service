# User Service API
## Описание
User Service API — приложение для управления пользователями. Оно позволяет регистрироваться, входить в систему, 
получать информацию о пользователях и управлять их статусами.

## Стек технологий
- TypeScript
- Express
- PostgreSQL
- TypeORM
- Docker

## Особенности реализации
Проект был разработан с использованием RESTful архитектуры и обеспечивает управление пользователями через API. Авторизация пользователя реализована c помощью Access и Refresh токенов.

## Техническое задание
Нужно разработать сервис работы с пользователями. Модель пользователя должна
содержать:
- ФИО
- Дату рождения
- Email - уникальное значение
- Пароль
- Роль - либо admin, либо user
- Статус пользователя - активный или нет

Должны быть реализованы следующие endpoint:
1. Регистрация пользователя
2. Авторизация пользователя - любой механизм
3. Получение пользователя по ID (Может получить либо админ, либо пользователь сам себя)
4. Получение списка пользователей - только для админа
5. Блокировка пользователя - админ либо пользователь сам себя

Важно обратить внимание на организацию структуры проекта, применять лучшие
практики.

Что использовать запрещено:
- NestJS

Что использовать можно:
- Express или koa
- Любую СУБД
- Любую ORM/ODM
- Желательно работу выполнить на Typescript, но JS так же допускается.

### Ожидаемый результат:
Репозиторий с исходным кодом, содержащий реализацию необходимых API-методов для работы с пользователями.

## Установка и запуск проекта
### Требования
- PostgreSQL
- Docker

### Установка зависимостей
1. Клонируйте репозиторий:
   ```bash
   git clone <repository-url>
   cd user-service
   ```
   
2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл .env в корне проекта и скопируйте значения из .env.example.

### Запуск приложения
Для запуска приложения используйте:
```bash
docker-compose up --build
```
и
```bash
npm run start:dev
```

## API
### Эндпоинты
1. Регистрация
   - URL: /auth/register
   - Метод: POST
   - Тело запроса:
      ```json
      {
         "firstName": "John",
         "lastName": "Doe",
         "secondName": "Smith",
         "birthday": "1990-01-01",
         "email": "john.doe@example.com",
         "password": "securepassword123",
         "role": "user"
      }
      ```
   - Ответ:
      
      (201 Created)
      ```json
      {
         "message": "User registered successfully"
      }
      ```


2. Авторизация
   - URL: /auth/login
   - Метод: POST
   - Тело запроса:
      ```json
      {
         "email": "john.doe@example.com",
         "password": "securepassword123"
      }
      ```
   - Ответ: 
   
      (200 OK)
      ```json
      {
         "accessToken": "your_access_token",
         "refreshToken": "your_refresh_token",
         "user": {
                    "firstName": "John",
                    "lastName": "Doe",
                    "secondName": "Smith",
                    "birthday": "1990-01-01",
                    "email": "john.doe@example.com",
                    "password": "securepassword123",
                    "role": "user"
                 }
      }
      ```


3. Обновление токена
   - URL: /auth/refresh
   - Метод: GET
   - Заголовок:
     - Authorization: Bearer your_refresh_token
   - Ответ: 
   
      (200 OK)
      ```json
      {
         "accessToken": "new_access_token",
         "refreshToken": "new_refresh_token"
      }
      ```


4. Получение пользователя
   - URL: /user/:id
   - Метод: GET
   - Заголовок:
     - Authorization: Bearer your_access_token
   - Ответ: 
   
      (200 OK)
      ```json
      {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "secondName": "Smith",
        "birthday": "1990-01-01",
        "email": "john.doe@example.com",
        "role": "user",
        "status": "active"
      }
      ```
   - Особенность: админ может получить любого пользователя, обычный пользователь только информацию о себе.


5. Получение списка пользователей
   - URL: /user
   - Метод: GET
   - Заголовок:
     - Authorization: Bearer your_access_token
   - Ответ: 

      (200 OK)
      ```json
      [
        {
          "id": "user-uuid-1",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "role": "user",
          "status": "active"
        },
        {
          "id": "user-uuid-2",
          "firstName": "Jane",
          "lastName": "Doe",
          "email": "jane.doe@example.com",
          "role": "admin",
          "status": "inactive"
        }
      ]
      ```
   - Особенность: список пользователей может получить только администратор.

6. Изменение статуса пользователя
   - URL: /user/toggleStatus/:id
   - Метод: GET
   - Заголовок:
     - Authorization: Bearer your_access_token
   - Ответ 
   
      (200 OK)
      ```json
      {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "role": "user",
        "status": "inactive"
      }
      ```
   - Особенность: администратор может изменить статус любого пользователя, обычный пользователь может изменить 
только свой статус.


## Архитектура базы данных
### Основные сущности:
User: хранит информацию о пользователе и его статусах.

#### Структура таблицы user:
- **id** - уникальный идентификатор 
  - тип: UUID, генерируется автоматически;
- **first_name** - имя  
  - тип: VARCHAR(255), обязательное;
- **last_name** - фамилия  
  - тип: VARCHAR(255), обязательное;
- **second_name** - отчество  
  - тип: VARCHAR(255), обязательное;
- **birthday** - дата рождения 
  - тип: DATE, обязательное;
- **email** - электронная почта 
  - тип: VARCHAR(255), уникальное, обязательное;
- **password** - хэшированный пароль 
  - тип: VARCHAR(255), уникальное, обязательное;
- **role** - роль 
  - тип: ENUM, значения: 'admin', 'user', по умолчанию 'user';
- **status** - статус 
  - тип: ENUM, значения: 'active', 'inactive', по умолчанию 'active'.

#### ENUM типы:
- **user_role** - роль пользователя 
  - admin, user;
- **user_status** - статус пользователя 
  - active, inactive.

## Перспективы развития
- Добавление трассировок, логирования для контроля запросов;
- Покрытие функционала тестами;
- Покрытие функционала документацией.










