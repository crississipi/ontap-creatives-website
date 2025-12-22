# Profile Management System - Setup Instructions

## Overview
This document provides instructions for setting up the complete user profile management system including profile editing, password changes, account deletion, and affiliate dashboard features.

## Database Schema Updates

### Step 1: Run SQL Migration
Execute the SQL script to add new columns and create the affiliate table:

```bash
# Navigate to the scripts directory
cd scripts

# Run the SQL script against your MySQL database
mysql -u your_username -p your_database_name < update_schema_affiliate.sql
```

Or manually execute the SQL commands:

```sql
-- Add coverImage and referredBy columns to client table
ALTER TABLE `client` ADD COLUMN `coverImage` VARCHAR(255) NULL;
ALTER TABLE `client` ADD COLUMN `referredBy` VARCHAR(100) NULL;

-- Create affiliate table
CREATE TABLE `affiliate` (
    `affiliateID` INTEGER NOT NULL AUTO_INCREMENT,
    `clientID` INTEGER NOT NULL,
    `affiliateCode` VARCHAR(100) NOT NULL,
    `totalEarnings` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    
    UNIQUE INDEX `affiliate_clientID_key`(`clientID`),
    UNIQUE INDEX `affiliate_affiliateCode_key`(`affiliateCode`),
    INDEX `affiliate_clientID_idx`(`clientID`),
    INDEX `affiliate_affiliateCode_idx`(`affiliateCode`),
    PRIMARY KEY (`affiliateID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraint
ALTER TABLE `affiliate` 
ADD CONSTRAINT `affiliate_clientID_fkey` 
FOREIGN KEY (`clientID`) REFERENCES `client`(`clientID`) 
ON DELETE CASCADE ON UPDATE CASCADE;
```

### Step 2: Generate Prisma Client
After updating the database schema, regenerate the Prisma client:

```bash
npx prisma generate
```

## API Endpoints

The following API endpoints have been created:

### Profile Management
- `GET /api/profile` - Get user profile information
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user account

### Image Upload
- `POST /api/profile/upload-image` - Upload profile or cover image
  - Body: FormData with `image` file and `type` ('profile' | 'cover')

### Security
- `PUT /api/profile/change-password` - Change user password
  - Body: `{ currentPassword, newPassword, confirmPassword }`

### Affiliate
- `GET /api/profile/affiliate` - Get affiliate dashboard data
  - Returns: affiliate code, stats, and referred clients

### Orders
- `GET /api/profile/orders` - Get user order history

## Required Environment Variables

Ensure your `.env` file includes:

```env
DATABASE_URL="mysql://username:password@localhost:3306/your_database"
JWT_SECRET="your-secure-jwt-secret-key"
```

## File Upload Directory

Create the uploads directory for profile images:

```bash
mkdir -p public/uploads/profiles
```

## Component Structure

### Main Components
- `UserProfile.tsx` - Main profile page with tabs
- `Settings.tsx` - Password change and account deletion
- `AffiliateDashboard.tsx` - Affiliate statistics and referrals
- `OrderHistory.tsx` - User order history

### Navigation Integration
The profile page is accessible via:
- Mobile sidebar: "Profile & Settings" button
- Page number: 9 in the main page router

## Features

### 1. Profile Editing
- Update name, email, phone, and address
- Real-time form validation
- API integration for saving changes

### 2. Image Upload
- Upload profile picture
- Upload cover image
- File type and size validation (max 5MB)
- Automatic file naming and storage

### 3. Password Management
- Current password verification
- New password validation (min 8 characters)
- Confirmation matching
- Secure bcrypt hashing

### 4. Account Deletion
- Confirmation modal with typed verification
- Option to keep email for newsletters
- Complete data cleanup
- Automatic logout after deletion

### 5. Affiliate Dashboard
- View affiliate code
- Copy code to clipboard
- Track earnings and referrals
- View referred client list
- Commission tracking

### 6. Order History
- View all past orders
- Search functionality
- Status tracking
- Order details

## Security Features

- JWT token authentication
- Session-based authorization
- Password hashing with bcrypt
- SQL injection protection via Prisma
- File type validation
- CORS protection

## Testing

1. **Profile Update**: Try updating your profile information
2. **Image Upload**: Upload a profile and cover image
3. **Password Change**: Change your password
4. **Affiliate Code**: Copy your affiliate code
5. **Order History**: View your orders
6. **Account Deletion**: Test the deletion flow (use a test account!)

## Troubleshooting

### Common Issues

1. **Database connection error**
   - Check DATABASE_URL in .env
   - Ensure MySQL is running
   - Verify database credentials

2. **Prisma client errors**
   - Run `npx prisma generate`
   - Check schema.prisma syntax

3. **Image upload fails**
   - Create `public/uploads/profiles` directory
   - Check file permissions
   - Verify file size and type

4. **JWT errors**
   - Ensure JWT_SECRET is set in .env
   - Check token expiration
   - Verify cookie settings

## Next Steps

1. Run the SQL migration script
2. Generate Prisma client
3. Create the uploads directory
4. Test all API endpoints
5. Configure your JWT secret
6. Test the UI components

## Support

For issues or questions, refer to:
- Prisma Documentation: https://www.prisma.io/docs
- Next.js API Routes: https://nextjs.org/docs/api-routes
- JWT Authentication: https://jwt.io/
