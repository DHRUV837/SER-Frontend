-- SQL Reference for Deal Table Updates (Sprint 1)
-- These changes are handled automatically by Hibernate ddl-auto=update

ALTER TABLE deal ADD COLUMN deal_name VARCHAR(255);
ALTER TABLE deal ADD COLUMN organization_name VARCHAR(255);
ALTER TABLE deal ADD COLUMN expected_close_date DATE;
ALTER TABLE deal ADD COLUMN priority VARCHAR(20) DEFAULT 'MEDIUM';
ALTER TABLE deal ADD COLUMN deal_notes TEXT;
ALTER TABLE deal ADD COLUMN policy_id BIGINT;
ALTER TABLE deal ADD COLUMN created_by BIGINT;
ALTER TABLE deal ADD COLUMN updated_at DATETIME;
ALTER TABLE deal ADD COLUMN deal_type VARCHAR(50);

-- Ensure audit_log can store entity details
ALTER TABLE audit_log MODIFY COLUMN details TEXT;
