-- SQL to fix missing column if ddl-auto failed
USE sales_reward;

-- Add onboarding_completed column if it doesn't exist
-- MySQL doesn't support IF NOT EXISTS for columns in ALTER TABLE directly in all versions, 
-- but running this is safe if it fails (it just won't add it).
-- However, to be safe, we can try:
ALTER TABLE users ADD COLUMN onboarding_completed BIT(1) DEFAULT 0;

-- Update existing users to have it set to true (assuming they are onboarded)
UPDATE users SET onboarding_completed = 1 WHERE onboarding_completed IS NULL;
