-- Restore User 5 and Generate Deals Data
-- Targets: Users 4, 5, 9, 13, 14, 15

-- 1. Recreate User 5 (Dhruvrathod123)
INSERT INTO users (id, email, password, name, role, account_status, notifications_enabled, onboarding_completed, first_deal_created) 
VALUES (5, 'dhruvrathod123@gmail.com', 'dhruv123', 'Dhruvrathod123', 'SALES', 'ACTIVE', 0, 1, 1);

-- 2. Restore Profile for User 5
INSERT IGNORE INTO sales_profiles (user_id, department) VALUES (5, 'Sales');
INSERT IGNORE INTO user_preferences (user_id, theme, language, currency) VALUES (5, 'light', 'en', 'INR');

-- 3. Ensure profiles exist for others (just in case)
INSERT IGNORE INTO sales_profiles (user_id, department) VALUES 
(4, 'Sales'), (9, 'Sales'), (13, 'Sales'), (14, 'Sales'), (15, 'Sales');

-- 4. Generate Deals (Jan & Feb 2026) for Users 4, 5, 9, 13, 14, 15

-- Dhruvrathod12 (ID 4)
INSERT INTO deal (user_id, client_name, amount, incentive, rate, status, date, deal_name, deal_type, legacy_deal, currency) VALUES
(4, 'TechCorp', 120000, 12000, 10.0, 'Approved', '2026-01-15', 'Cloud Migration', 'New Business', 0, 'INR'),
(4, 'Innovate Ltd', 85000, 8500, 10.0, 'Approved', '2026-01-28', 'License Renewal', 'Renewal', 0, 'INR'),
(4, 'WebSys', 45000, 4500, 10.0, 'Approved', '2026-02-05', 'Consulting', 'New Business', 0, 'INR'),
(4, 'DataFlow', 150000, 15000, 10.0, 'Approved', '2026-02-12', 'Enterprise Plan', 'Upsell', 0, 'INR');

-- Dhruvrathod123 (ID 5)
INSERT INTO deal (user_id, client_name, amount, incentive, rate, status, date, deal_name, deal_type, legacy_deal, currency) VALUES
(5, 'Alpha Inc', 95000, 9500, 10.0, 'Approved', '2026-01-10', 'CRM Setup', 'New Business', 0, 'INR'),
(5, 'Beta Corp', 60000, 6000, 10.0, 'Approved', '2026-01-22', 'Support Contract', 'Renewal', 0, 'INR'),
(5, 'Gamma LLC', 110000, 11000, 10.0, 'Approved', '2026-02-02', 'System Upgrade', 'Upsell', 0, 'INR'),
(5, 'Delta Grp', 30000, 3000, 10.0, 'Approved', '2026-02-08', 'Training', 'New Business', 0, 'INR'),
(5, 'Omega Sys', 200000, 20000, 10.0, 'Approved', '2026-02-13', 'Full Suite', 'New Business', 0, 'INR');

-- Aryan12 (ID 9)
INSERT INTO deal (user_id, client_name, amount, incentive, rate, status, date, deal_name, deal_type, legacy_deal, currency) VALUES
(9, 'Solaris', 75000, 7500, 10.0, 'Approved', '2026-01-18', 'Solar Panel Deal', 'New Business', 0, 'INR'),
(9, 'Lunar Inc', 50000, 5000, 10.0, 'Approved', '2026-02-01', 'Battery Pack', 'Upsell', 0, 'INR'),
(9, 'Stellar', 125000, 12500, 10.0, 'Approved', '2026-02-10', 'Enterprise Grid', 'New Business', 0, 'INR');

-- Divya (ID 13)
INSERT INTO deal (user_id, client_name, amount, incentive, rate, status, date, deal_name, deal_type, legacy_deal, currency) VALUES
(13, 'FashionWeek', 80000, 8000, 10.0, 'Approved', '2026-01-25', 'Sponsorship', 'New Business', 0, 'INR'),
(13, 'StyleCo', 40000, 4000, 10.0, 'Approved', '2026-02-03', 'Ad Campaign', 'New Business', 0, 'INR'),
(13, 'Vogue', 160000, 16000, 10.0, 'Approved', '2026-02-11', 'Partnership', 'Upsell', 0, 'INR');

-- divy (ID 14)
INSERT INTO deal (user_id, client_name, amount, incentive, rate, status, date, deal_name, deal_type, legacy_deal, currency) VALUES
(14, 'BuildIt', 90000, 9000, 10.0, 'Approved', '2026-01-20', 'Raw Materials', 'New Business', 0, 'INR'),
(14, 'Constructo', 55000, 5500, 10.0, 'Approved', '2026-02-06', 'Equipment Lease', 'New Business', 0, 'INR');

-- Axit Kapadiya (ID 15)
INSERT INTO deal (user_id, client_name, amount, incentive, rate, status, date, deal_name, deal_type, legacy_deal, currency) VALUES
(15, 'HealthPlus', 140000, 14000, 10.0, 'Approved', '2026-01-12', 'Medical Supplies', 'New Business', 0, 'INR'),
(15, 'CareFirst', 70000, 7000, 10.0, 'Approved', '2026-02-04', 'Insurance Plan', 'Renewal', 0, 'INR'),
(15, 'MediCorp', 115000, 11500, 10.0, 'Approved', '2026-02-13', 'Hospital Equipment', 'New Business', 0, 'INR');
