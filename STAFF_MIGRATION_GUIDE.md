# Staff Model Migration Guide

To enable staff management functionality, you need to add the `staff` model to your Prisma schema and run a migration.

## Step 1: Update Prisma Schema

Add this to the end of `prisma/schema.prisma` (before or after the `admin` model):

```prisma
model staff {
  staffID       Int       @id @default(autoincrement())
  clientID      Int
  firstName     String    @db.VarChar(100)
  lastName      String    @db.VarChar(100)
  email         String    @db.VarChar(100)
  role          String    @db.VarChar(100)
  dateAdded     DateTime  @default(now())
  
  // Authorization flags
  viewDashboard Boolean   @default(false)
  viewOrders    Boolean   @default(false)
  viewClients   Boolean   @default(false)
  viewAffiliates Boolean  @default(false)
  addProducts   Boolean   @default(false)
  changeContent Boolean   @default(false)
  addOffers     Boolean   @default(false)
  
  client        client    @relation(fields: [clientID], references: [clientID], onDelete: Cascade)
  
  @@index([clientID], map: "staff_clientID_fkey")
  @@map("staff")
}
```

Also update the `client` model to include the relation:
```prisma
model client {
  // ... existing fields ...
  
  // Add this line
  staff         staff[]
  
  @@map("client")
}
```

## Step 2: Create and Run Migration

Run in PowerShell from project root:

```powershell
npx prisma migrate dev --name add_staff_table
```

This will:
- Create a new migration file
- Update your database schema
- Regenerate Prisma Client

## Step 3: Restart Dev Server

```powershell
npm run dev
```

Now the staff API endpoints and Settings component will work correctly!

## API Endpoints Available

Once the migration is complete, you can use:

- `GET /api/client/profile` - Get user profile
- `PUT /api/client/profile` - Update user profile
- `GET /api/client/staff` - Get all staff members
- `POST /api/client/staff` - Add new staff
- `PUT /api/client/staff` - Update staff
- `DELETE /api/client/staff` - Delete staff
