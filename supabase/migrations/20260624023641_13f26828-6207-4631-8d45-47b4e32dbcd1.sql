-- 1. Additive columns on orders (all nullable / defaulted — existing inserts keep working)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS upi_txn_id text,
  ADD COLUMN IF NOT EXISTS is_late_request boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- 2. Delivery zones table
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  delivery_fee integer NOT NULL DEFAULT 0,
  min_qty integer NOT NULL DEFAULT 1,
  meals text NOT NULL DEFAULT 'both',
  subscription_only boolean NOT NULL DEFAULT false,
  cod_allowed boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.delivery_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_zones TO authenticated;
GRANT ALL ON public.delivery_zones TO service_role;

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active zones"
  ON public.delivery_zones FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage zones"
  ON public.delivery_zones FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_delivery_zones_updated_at
  BEFORE UPDATE ON public.delivery_zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Seed Noida sectors
INSERT INTO public.delivery_zones (sector, active, delivery_fee, min_qty, meals, subscription_only, cod_allowed, sort_order)
VALUES
  ('Sector 58', true, 0, 1, 'both', false, true, 1),
  ('Sector 59', true, 0, 1, 'both', false, true, 2),
  ('Sector 62', true, 0, 1, 'both', false, true, 3),
  ('Sector 63', true, 0, 1, 'both', false, true, 4),
  ('Sector 65', true, 0, 1, 'both', false, true, 5),
  ('Sector 76', true, 0, 1, 'both', false, true, 6),
  ('Sector 78', true, 0, 1, 'both', false, true, 7),
  ('Sector 137', true, 20, 1, 'both', false, true, 8),
  ('Sector 142', true, 20, 1, 'both', false, true, 9),
  ('Other (nearby)', true, 30, 2, 'both', false, false, 10)
ON CONFLICT (sector) DO NOTHING;