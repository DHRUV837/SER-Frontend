CREATE DATABASE IF NOT EXISTS sales_reward;
USE sales_reward;

-- Create user if not exists (handling for various MySQL versions/local setups)
-- Note: 'root' usually exists. We just ensure it has access.
GRANT ALL PRIVILEGES ON sales_reward.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- We don't need to create tables here because hibernate.hbm2ddl.auto=update will handle it.
