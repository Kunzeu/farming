-- Migration: Add Patreon OAuth fields to users table
-- Date: 2025-10-28
-- Description: Adds support for Patreon OAuth integration

-- Add Patreon columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS patreon_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS patreon_tier VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS patreon_status VARCHAR(50);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_patreon_id ON users(patreon_id);
CREATE INDEX IF NOT EXISTS idx_users_patreon_status ON users(patreon_status);

-- Add constraint to ensure valid patreon_status values
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_patreon_status;
ALTER TABLE users ADD CONSTRAINT check_patreon_status 
  CHECK (patreon_status IS NULL OR patreon_status IN ('active_patron', 'declined_patron', 'former_patron'));

-- Add comments for documentation
COMMENT ON COLUMN users.patreon_id IS 'Unique Patreon user ID for OAuth authentication';
COMMENT ON COLUMN users.patreon_tier IS 'Current Patreon membership tier/level name';
COMMENT ON COLUMN users.patreon_status IS 'Current Patreon membership status: active_patron, declined_patron, or former_patron';

-- Optional: Add unique constraint on patreon_id (if you want to prevent duplicate Patreon accounts)
-- Uncomment the line below if you want this behavior:
-- ALTER TABLE users ADD CONSTRAINT unique_patreon_id UNIQUE (patreon_id);

-- Verification query to check if columns were added successfully
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'users' 
  AND column_name IN ('patreon_id', 'patreon_tier', 'patreon_status')
ORDER BY 
  ordinal_position;
