-- Migration Script: Add Deal Assignment Workflow Fields
-- Sprint 1: Backend Foundation

-- Add new columns to Deal table
ALTER TABLE deal ADD COLUMN IF NOT EXISTS deal_name VARCHAR(255);
ALTER TABLE deal ADD COLUMN IF NOT EXISTS organization_name VARCHAR(255);
ALTER TABLE deal ADD COLUMN IF NOT EXISTS expected_close_date DATE;
ALTER TABLE deal ADD COLUMN IF NOT EXISTS priority VARCHAR(20);  -- LOW, MEDIUM, HIGH
ALTER TABLE deal ADD COLUMN IF NOT EXISTS deal_notes TEXT;
ALTER TABLE deal ADD COLUMN IF NOT EXISTS policy_id BIGINT;
ALTER TABLE deal ADD COLUMN IF NOT EXISTS created_by BIGINT;
ALTER TABLE deal ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Update existing legacy deals with default values
UPDATE deal 
SET deal_name = CONCAT('Legacy Deal - ', DATE_FORMAT(date, '%b %Y')),
    organization_name = 'Legacy Client',
    priority = 'MEDIUM',
    created_by = (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1),
    updated_at = created_at
WHERE deal_name IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_deal_status ON deal(status);
CREATE INDEX IF NOT EXISTS idx_deal_user_id ON deal(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_organization ON deal(organization_name);
CREATE INDEX IF NOT EXISTS idx_deal_priority ON deal(priority);

-- Comments for documentation
COMMENT ON COLUMN deal.deal_name IS 'Human-readable deal name (e.g. "Flipkart Q1 Expansion")';
COMMENT ON COLUMN deal.organization_name IS 'Client/Company name';
COMMENT ON COLUMN deal.expected_close_date IS 'Target close date set by admin';
COMMENT ON COLUMN deal.priority IS 'Deal priority: LOW, MEDIUM, or HIGH';
COMMENT ON COLUMN deal.deal_notes IS 'Internal notes and comments';
COMMENT ON COLUMN deal.policy_id IS 'Reference to incentive policy';
COMMENT ON COLUMN deal.created_by IS 'Admin user ID who created the deal';
COMMENT ON COLUMN deal.updated_at IS 'Last modification timestamp';
