# Bitespeed Identity Reconciliation Service

## 📋 Project Description
The **Bitespeed Identity Reconciliation Service** is a robust backend solution designed for FluxKart.com to provide a personalized customer experience. In a world where customers like Dr. Emmett Brown use multiple email addresses and phone numbers to keep their projects discreet, this service solves the unique challenge of linking disparate contact information back to a single, unified customer identity.

By crawling through existing contact data, the service automatically merges records, designates "primary" and "secondary" markers, and ensures a consistent view of every shopper's journey.

## 🚀 Key Features
- **Identity Linking**: Automatically connects multiple contact records based on overlapping email or phone number details.
- **Primary-Secondary Logic**: Implements a sophisticated precedence system where the oldest record remains "primary," and all subsequent linked records become "secondary."
- **Automatic Merging**: Handles complex "split" identities where two previously disconnected primary identities are merged upon discovery of a shared contact point.
- **RESTful API**: Simple and efficient `/identify` endpoint accepting JSON payloads.
- **ORM Powered**: Built with Prisma and PostgreSQL for high performance and reliable data integrity.
- **Cloud Native**: Pre-configured for seamless deployment on both Render and Vercel.

## 🛠️ Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL (Neon DB)](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Language**: JavaScript (ES6+)

---

## 🔗 API Reference

### POST `/identify`
Consolidates contact information for a user.

**Request Body:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Response Format:**
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

---

## 💻 Local Setup

1. **Clone the project:**
   ```bash
   git clone https://github.com/satendra-513/biteSpeed-Assignment.git
   cd biteSpeed-Assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
   PORT=3000
   ```

4. **Initialize Database:**
   ```bash
   npm run db:migrate
   ```

5. **Run the Server:**
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Configure the `DATABASE_URL` environment variable in the Vercel dashboard.

### Deploy to Render
1. Connect your GitHub repository to Render.
2. Select "Web Service."
3. Use `npm start` as the Start Command.
4. Add the `DATABASE_URL` environment variable.

---

## 📁 Project Structure
```text
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migration history
├── src/
│   ├── app.js                # Express app entry & Vercel export
│   ├── db.js                 # Prisma client singleton
│   └── contact/
│       ├── contact.router.js # Endpoint routing
│       ├── contact.service.js# Core reconciliation logic
│       └── contact.repository.js # DB query layer
├── vercel.json               # Vercel deployment config
└── README.md                 # Project documentation
```

Created with ❤️ for Bitespeed.
