# Ecommerce Platform Backend

## Quick Start Guide

### 1. Environment Setup

Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="24h"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=3000
NODE_ENV="development"
```

### 2. Database Setup

1. Start PostgreSQL service
2. Create database:
```sql
CREATE DATABASE ecommerce_db;
```

### 3. Prisma Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Open Prisma Studio (optional)
npx prisma studio
```

### 4. Start the Server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Testing with Swagger

1. Start the server
2. Open http://localhost:3000/api-docs
3. Try out the endpoints:
   - Click on an endpoint
   - Click "Try it out"
   - Fill in required parameters
   - Click "Execute"

## Available Endpoints

### Public Endpoints
- POST `/auth/login`
- POST `/auth/register`
- GET `/products`
- GET `/categories`

### Protected Endpoints (Requires Authentication)
Use the Bearer token received from login:

#### User Management
- GET `/users/profile`
- PATCH `/users/profile`
- GET `/users/:id` (Admin only)

#### Product Management
- POST `/products` (Seller/Enterprise only)
- PATCH `/products/:id` (Owner only)
- DELETE `/products/:id` (Owner only)

#### Order Management
- POST `/orders`
- GET `/orders/my-orders`
- GET `/orders/:id`

## Development Notes

### Generate New Migration
```bash
npx prisma migrate dev --name migration_name
```

### Reset Database
```bash
npx prisma migrate reset
```

### Update API Documentation
Swagger documentation is auto-generated from decorators in the controllers.

Example controller decoration:
```typescript
@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findAll() {
    // ...
  }
}
```

### Database Schema Updates
1. Modify `prisma/schema.prisma`
2. Run migration:
```bash
npx prisma migrate dev --name descriptive_name
```
3. Update related services and DTOs
4. Test affected endpoints in Swagger

## Troubleshooting

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database and migrations
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

### Server Issues
```bash
# Clear Node modules and reinstall
rm -rf node_modules
npm install

# Check for TypeScript errors
npm run lint

# Run tests
npm run test
```

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env
3. Try connecting with psql:
```bash
psql -U postgres -d ecommerce_db
```

## Deployment Checklist

1. Update environment variables
2. Run database migrations
3. Build the application:
```bash
npm run build
```
4. Start production server:
```bash
npm run start:prod
```

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Swagger OpenAPI](https://swagger.io/specification/)



##chạy lệnh này để seed dữ liệu
npx ts-node prisma/seed.ts


thẻ ngân hàng cho demo VNPAY 

Ngân hàng	NCB
Số thẻ	9704198526191432198
Tên chủ thẻ	NGUYEN VAN A
Ngày phát hành	07/15
Mật khẩu OTP	123456