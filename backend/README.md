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




<!-- APIS -->
### API Examples

#### Authentication
```bash
# Admin Login
curl -X POST \
  'http://{url}/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'

# Admin Logout
curl -X POST \
  'http://{url}/auth/logout' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

#### Admin Users
```bash
# Get All Admin Users
curl -X GET \
  'http://{url}/admin/users' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

# Get Admin User by ID
curl -X GET \
  'http://{url}/admin/users/123' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

#### Admin Roles
```bash
# Get All Admin Roles
curl -X GET \
  'http://{url}/admin/roles' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### Categories API
