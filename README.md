# Cutshort Assignment

Assignment to demostrate technical skill of implementing basic CRUD operation using MongoDB.

### Tech Stack
- Nest.js Framework - Express based type safe opiniated backend framework.
- MongoDB - Database layer
- Mongoose - ODM to connect with MongoDB
- Class Validator - To check incoming request fullfilling required fields
- Passport JWT Auth - For authentication
- Argon2 - For hashing password
- Custom guards for Role (ADMIN, USER)

### Deploy
1. Copy `.env.example` to `.env`, all keys are required.
2. A `Dockerfile` has been added to deployment in most of PaaS easy, like [Fly.io](https://fly.io/), [Railway](https://railway.app/), [Render](https://render.com/), [Cyclic](https://www.cyclic.sh/) AWS ECS, AWS Lambda, Google Cloud Run etc or in Kubernetes/Nomad. 
2. Generate secrets using following command, run it 2 times, in prod Never keep `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` and add them as environment variable as per platform you are using.
```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```
Note: Server will not start if its not able to connect with MongoDB.

### Usage
- Server expose `/docs` for swagger UI and `/docs-json` for OpenApi specs.
- All routes are protected using `AccessTokenGuard` which requires `Authorization` header to be present with `Bearer {Token}` as value except `/post`.
- All APIs are rate-limited to `6 req/s` except `/post` which is rate-limited to `2 req/sec` being an open api.
- There are 2 roles, ADMIN and USER.
- Updating a user, post and todos is only allowed by admin or user themselves.