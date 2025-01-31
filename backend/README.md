Backend Dir Structure

```
backend/
│── src/
│   ├── db/                 # Drizzle ORM setup (schema, migrations)
│   ├── routes/             # API route handlers
│   ├── controllers/        # Business logic for routes
│   ├── services/           # Database queries (Drizzle interactions)
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── index.ts            # Fastify server entry point
│── .env                    # Environment variables
│── package.json            # Dependencies
│── tsconfig.json           # TypeScript config
│── pnpm-lock.yaml          # pnpm lockfile
│── drizzle.config.ts       # Drizzle ORM config
│── README.md               # Documentation
```

ADMIN Panel
{url}

/auth/login - admin login
/auth/logout - admin logout

GET /admin/users - all admin users
GET /admin/users/:id - admin user by id

GET /admin/roles - all admin roles
