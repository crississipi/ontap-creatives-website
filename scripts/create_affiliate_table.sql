-- CreateTable for affiliate_application
CREATE TABLE IF NOT EXISTS `affiliate_application` (
    `applicationID` INTEGER NOT NULL AUTO_INCREMENT,
    
    -- Part 1: General Information
    `fullLegalName` VARCHAR(200) NOT NULL,
    `preferredDisplayName` VARCHAR(200) NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `nationality` VARCHAR(100) NOT NULL,
    `govIdType` VARCHAR(100) NULL,
    `govIdNumber` VARCHAR(100) NULL,
    `primaryEmail` VARCHAR(255) NOT NULL,
    `secondaryEmail` VARCHAR(255) NULL,
    `mobileNumber` VARCHAR(50) NOT NULL,
    `alternativeContactNumber` VARCHAR(50) NULL,
    `completeResidentialAddress` TEXT NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `timeZone` VARCHAR(100) NOT NULL,
    `desiredAffiliateUsername` VARCHAR(100) NOT NULL,
    `howDidYouHear` VARCHAR(255) NOT NULL,
    
    -- Part 2: Occupation History / Relevant Experience
    `currentOccupation` VARCHAR(200) NOT NULL,
    `employmentType` VARCHAR(100) NOT NULL,
    `companyBusinessName` VARCHAR(200) NULL,
    `industryField` VARCHAR(200) NOT NULL,
    `yearsOfExperience` VARCHAR(50) NOT NULL,
    `previousAffiliateExperience` BOOLEAN NOT NULL,
    `platformsWorkedWith` TEXT NULL,
    `durationOfAffiliateExp` VARCHAR(100) NULL,
    `averageMonthlyPerformance` VARCHAR(255) NULL,
    `primarySkills` TEXT NOT NULL,
    `toolsPlatformsUsed` TEXT NOT NULL,
    `registeredBusinessName` VARCHAR(200) NULL,
    `businessType` VARCHAR(100) NULL,
    `businessWebsiteUrl` TEXT NULL,
    
    -- Part 3: Marketing Strategy & Audience Reach
    `audienceDescription` TEXT NOT NULL,
    `geographicReach` VARCHAR(255) NOT NULL,
    `estimatedAudienceSize` VARCHAR(100) NOT NULL,
    `marketingChannels` TEXT NOT NULL,
    `socialMediaLinks` TEXT NULL,
    `websiteBlogUrl` TEXT NULL,
    `emailListSize` VARCHAR(100) NULL,
    `promotionPlan` TEXT NOT NULL,
    `primaryContentFormat` VARCHAR(255) NOT NULL,
    `estimatedMonthlySales` VARCHAR(100) NULL,
    
    -- Part 4: Agreements and Compliance
    `accurateInformationConfirmed` BOOLEAN NOT NULL,
    `termsConditionsAgreed` BOOLEAN NOT NULL,
    `privacyPolicyAgreed` BOOLEAN NOT NULL,
    `brandingGuidelinesConfirmed` BOOLEAN NOT NULL,
    `ethicalMarketingConfirmed` BOOLEAN NOT NULL,
    `competingAffiliations` TEXT NULL,
    
    -- Application metadata
    `applicationStatus` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` INTEGER NULL,
    `reviewNotes` TEXT NULL,

    PRIMARY KEY (`applicationID`),
    UNIQUE INDEX `affiliate_application_desiredAffiliateUsername_key`(`desiredAffiliateUsername`),
    INDEX `affiliate_application_primaryEmail_idx`(`primaryEmail`),
    INDEX `affiliate_application_desiredAffiliateUsername_idx`(`desiredAffiliateUsername`),
    INDEX `affiliate_application_applicationStatus_idx`(`applicationStatus`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
