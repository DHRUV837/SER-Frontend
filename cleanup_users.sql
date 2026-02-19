-- SQL script to delete test users and keep only real salesmen
-- KEEP: IDs 1 (admin), 3, 4, 7, 9, 13, 14, 15
-- DELETE: All others

-- First, delete related data for users we want to remove
DELETE FROM user_preferences WHERE user_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM sales_profiles WHERE user_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM sales_performance WHERE user_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM notifications WHERE user_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM invitations WHERE invited_by_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM audit_logs WHERE user_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);

-- Delete deals (handle both user_id, assigned_to_user_id, created_by, and approved_by)
DELETE FROM deal WHERE user_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM deal WHERE assigned_to_user_id IS NOT NULL AND assigned_to_user_id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM deal WHERE created_by IS NOT NULL AND created_by NOT IN (1, 3, 4, 7, 9, 13, 14, 15);
DELETE FROM deal WHERE approved_by IS NOT NULL AND approved_by NOT IN (1, 3, 4, 7, 9, 13, 14, 15);

-- Now delete the users
DELETE FROM users WHERE id NOT IN (1, 3, 4, 7, 9, 13, 14, 15);

-- Verify remaining users
SELECT id, email, name, role FROM users ORDER BY id;
