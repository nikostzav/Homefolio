-- Adds per-criterion importance weights and a city criterion to UserCriteria,
-- so Fuzzy TOPSIS ranking can take a weighted multi-criteria preference set
-- instead of treating every selected criterion as equally important.
--
-- Safe to run against the existing production database: every change is
-- additive and idempotent (IF NOT EXISTS / DROP CONSTRAINT IF EXISTS before
-- re-adding), so it can be re-run without error. Existing rows get
-- 'medium' weight and city=false by column defaults.
--
-- Run manually against the target database, e.g.:
--   psql "$DATABASE_URL" -f backend/db/migrations/001_preference_weights_and_city.sql

ALTER TABLE "UserCriteria"
    ADD COLUMN IF NOT EXISTS bedroom_weight character varying(10) DEFAULT 'medium',
    ADD COLUMN IF NOT EXISTS bathroom_weight character varying(10) DEFAULT 'medium',
    ADD COLUMN IF NOT EXISTS price_weight character varying(10) DEFAULT 'medium',
    ADD COLUMN IF NOT EXISTS city boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS city_weight character varying(10) DEFAULT 'medium',
    ADD COLUMN IF NOT EXISTS preferred_city character varying(255);

ALTER TABLE "UserCriteria" DROP CONSTRAINT IF EXISTS "UserCriteria_weights_check";
ALTER TABLE "UserCriteria"
    ADD CONSTRAINT "UserCriteria_weights_check" CHECK (
        bedroom_weight IN ('low', 'medium', 'high', 'very_high')
        AND bathroom_weight IN ('low', 'medium', 'high', 'very_high')
        AND price_weight IN ('low', 'medium', 'high', 'very_high')
        AND city_weight IN ('low', 'medium', 'high', 'very_high')
    );
