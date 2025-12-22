# Affiliate Application System

## Overview
A comprehensive multi-step affiliate application form with backend validation, database storage, and automated processing.

## Features Implemented

### 1. Database Schema
- Created `affiliate_application` table in Prisma schema
- Stores all 4 parts of the application
- Includes application status tracking
- Supports review workflow with notes

### 2. Backend API Endpoints

#### `/api/affiliate/check` (POST)
- Validates email and username availability
- Prevents duplicate applications
- Real-time validation during form filling

#### `/api/affiliate/apply` (POST)
- Comprehensive server-side validation
- Validates email format, phone numbers, and URLs
- Stores application data
- Returns application ID on success

### 3. Multi-Step Form Components

#### Part 1: General Information
- Personal details (name, DOB, nationality, ID)
- Contact information (email, phone)
- Address information
- Affiliate account setup

#### Part 2: Occupation History / Relevant Experience
- Professional status
- Work experience in relevant fields
- Previous affiliate marketing experience
- Skills and expertise
- Business presence (if applicable)

#### Part 3: Marketing Strategy & Audience Reach
- Audience profile and demographics
- Marketing channels (multi-select)
- Social media presence (all major platforms)
- Customer acquisition plan
- Content format preferences

#### Part 4: Summary & Agreements
- Application summary review
- Terms and conditions
- Privacy policy agreement
- Brand compliance confirmations
- Competing affiliations disclosure

### 4. Form Validation
- Real-time field validation
- Required field checking
- Email format validation
- Phone number validation (international format)
- URL validation for websites
- Duplicate email/username checking
- Step-by-step validation (can't proceed without valid data)

### 5. Success Page with Redirect
- Confirmation message
- 10-second countdown timer
- Auto-redirect to homepage
- Manual redirect button option

### 6. UI/UX Features
- Progress indicator with 4 steps
- Smooth transitions between steps
- Error messages inline with fields
- Loading states for submission
- Responsive design (mobile-friendly)
- Dropdown styling matching reference images
- Clean, professional layout

## Database Migration

To create the affiliate_application table in your database:

\`\`\`bash
# Option 1: Using Prisma Migrate (requires shadow database permissions)
npx prisma migrate dev --name add_affiliate_application_table

# Option 2: Run the SQL script manually
# Execute the SQL in: scripts/create_affiliate_table.sql
\`\`\`

## File Structure

\`\`\`
app/api/affiliate/
├── check/route.ts          # Email/username availability check
└── apply/route.ts          # Application submission

components/
├── AffiliateApplicationForm.tsx  # Main form container
└── affiliate/
    ├── Part1.tsx          # General information
    ├── Part2.tsx          # Experience
    ├── Part3.tsx          # Marketing strategy
    └── Part4.tsx          # Summary & agreements

prisma/
└── schema.prisma          # Database schema with affiliateApplication model

scripts/
└── create_affiliate_table.sql  # Manual migration SQL
\`\`\`

## Usage

### For Users
1. Navigate to the Affiliate Program page
2. Fill out the 4-step application form
3. Review summary and accept terms
4. Submit application
5. Receive confirmation and await review

### For Admins
Applications are stored in the `affiliate_application` table with status "pending".

To view applications:
\`\`\`sql
SELECT * FROM affiliate_application WHERE applicationStatus = 'pending';
\`\`\`

To update application status:
\`\`\`sql
UPDATE affiliate_application 
SET applicationStatus = 'approved',
    reviewedAt = NOW(),
    reviewedBy = [admin_id],
    reviewNotes = 'Application approved'
WHERE applicationID = [application_id];
\`\`\`

## Validation Rules

### Email
- Must be valid email format
- Must be unique (no duplicate applications)

### Phone Number
- Must contain 10-15 digits
- Supports international format with country code

### Username
- Must be unique
- Case-insensitive checking

### URLs
- Must be valid URL format (https://...)
- Optional fields (won't block submission if empty)

### Required Fields
All fields marked with red asterisk (*) must be filled before proceeding to next step.

## API Response Examples

### Check Email/Username
\`\`\`json
POST /api/affiliate/check
{
  "email": "test@example.com",
  "username": "testuser"
}

Response:
{
  "emailExists": false,
  "usernameExists": true
}
\`\`\`

### Submit Application
\`\`\`json
POST /api/affiliate/apply
{
  "fullLegalName": "John Doe",
  "primaryEmail": "john@example.com",
  // ... all other fields
}

Success Response (201):
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": 123
}

Error Response (400):
{
  "error": "Missing required fields: fullLegalName, primaryEmail"
}

Conflict Response (409):
{
  "error": "An application with this email already exists"
}
\`\`\`

## Customization

### Styling
The form uses Tailwind CSS with custom color variables from global.css:
- `violet` - Primary action color
- `dark-blue` - Hover states
- `blue` - Links and accents
- `light-blue` - Background tints

### Adding Fields
1. Update the Prisma schema
2. Add to FormData interface
3. Add to form components (Part1-4)
4. Update validation in AffiliateApplicationForm
5. Update backend validation in apply/route.ts

## Security Features
- Server-side validation for all inputs
- SQL injection protection via Prisma ORM
- Email/username uniqueness enforcement
- No sensitive data stored in NFC chip reference
- HTTPS recommended for production

## Future Enhancements
- Email notifications to admins on new applications
- Email confirmation to applicants
- Admin dashboard for reviewing applications
- Bulk approval/rejection
- Application analytics and reporting
- File upload for ID verification
- Integration with payment/commission tracking system
