-- Add coverImage to client table
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
    PRIMARY KEY (`affiliateID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key for affiliate
ALTER TABLE `affiliate` ADD CONSTRAINT `affiliate_clientID_fkey` FOREIGN KEY (`clientID`) REFERENCES `client`(`clientID`) ON DELETE RESTRICT ON UPDATE CASCADE;
