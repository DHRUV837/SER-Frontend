-- Manually create the app_users table to resolve Render deployment issues
-- Hibernate 'update' strategy will add any missing columns automatically.

CREATE TABLE IF NOT EXISTS app_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    name VARCHAR(255),
    account_status VARCHAR(50) DEFAULT 'ACTIVE',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    
    -- Additional fields (Hibernate will sync these if they mismatch, preventing 'relation not found' error)
    mobile VARCHAR(255),
    profile_photo_url TEXT,
    department VARCHAR(255),
    organization_name VARCHAR(255),
    branch VARCHAR(255),
    job_title VARCHAR(255),
    manager_name VARCHAR(255),
    territory VARCHAR(255),
    product_category VARCHAR(255),
    experience_level VARCHAR(255),
    incentive_type VARCHAR(255),
    notifications_config TEXT,
    legal_accepted BOOLEAN DEFAULT FALSE,
    
    -- Progress flags
    first_target_created BOOLEAN DEFAULT FALSE,
    first_deal_created BOOLEAN DEFAULT FALSE,
    first_rule_configured BOOLEAN DEFAULT FALSE,
    first_user_invited BOOLEAN DEFAULT FALSE
);
