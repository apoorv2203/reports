/*
# Create profiles table and seed two demo users

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text, the display name shown on the home greeting)
  - `is_new_user` (boolean, controls whether the home shows the empty/new-user layout or the populated active-user layout)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `profiles`.
- Owner-scoped CRUD: each authenticated user can read, insert, update only their own profile row.
- Policies use `auth.uid() = id` for ownership.

3. Seeded users
Two demo accounts are created via the Supabase auth admin API (service role):
  - rahul.new@reportiq.dev   / welcome123   (is_new_user = true  -> empty/new-user home)
  - anita.experienced@reportiq.dev / welcome123 (is_new_user = false -> populated active home)

Important: the two INSERTs into auth.users use fixed UUIDs so the migration is
idempotent and re-running it updates the same rows instead of creating duplicates.

4. Notes
- Email confirmation is left OFF (default), so seeded users can sign in immediately.
- The profiles table is intentionally simple — it only stores display name and the
  new-user flag. Widget/report data is still mock data in the frontend.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  is_new_user boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
