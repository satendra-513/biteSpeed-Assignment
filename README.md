# Bitespeed Identity Reconciliation

A backend service that identifies and links customer contacts across multiple purchases using different email addresses and phone numbers.

## Live Endpoint

> **Base URL:** `<your-render-url>`

### POST `/identify`

Identifies or creates a contact based on email and/or phone number.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": "123456"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon DB)
- **Hosting:** Render

## Local Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Neon DB connection string:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
   ```
4. Run Prisma migration:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app.js                        # Express app entry point
├── db.js                         # Prisma client singleton
└── contact/
    ├── contact.router.js         # Route definitions
    ├── contact.service.js        # Business logic
    └── contact.repository.js     # Database queries
prisma/
└── schema.prisma                 # DB schema
```
