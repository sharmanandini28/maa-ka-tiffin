-- Admin-managed manual UPI payment settings.
-- Additive only: creates a new settings table and optional audit-log action support.

CREATE TABLE IF NOT EXISTS public.payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upi_id text NOT NULL,
  payee_name text NOT NULL,
  payment_instructions text,
  screenshot_instructions text,
  transaction_id_required boolean NOT NULL DEFAULT false,
  upi_enabled boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payment_settings_upi_id_not_blank CHECK (length(btrim(upi_id)) > 0),
  CONSTRAINT payment_settings_payee_name_not_blank CHECK (length(btrim(payee_name)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS payment_settings_single_active_idx
  ON public.payment_settings (is_active)
  WHERE is_active = true;

GRANT SELECT ON public.payment_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.payment_settings TO authenticated;
GRANT ALL ON public.payment_settings TO service_role;

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active payment settings"
  ON public.payment_settings
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage payment settings"
  ON public.payment_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON public.payment_settings;
CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.payment_settings (
  upi_id,
  payee_name,
  payment_instructions,
  screenshot_instructions,
  transaction_id_required,
  upi_enabled,
  is_active
)
VALUES (
  'your-upi-id@bank',
  'Maa Jaisa Tiffin',
  'Razorpay/payment gateway use nahi ho raha hai. Aap direct UPI QR se payment karenge. Payment ke baad screenshot WhatsApp par bhejna zaroori hai. Admin payment verify karne ke baad order confirm karega.',
  'Payment complete karne ke baad screenshot WhatsApp par bhejein. Admin verify hone ke baad order confirm hoga.',
  false,
  true,
  true
)
ON CONFLICT DO NOTHING;

DO $$
BEGIN
  IF to_regclass('public.admin_action_logs') IS NOT NULL THEN
    ALTER TABLE public.admin_action_logs
      DROP CONSTRAINT IF EXISTS admin_action_logs_action_type_check;

    ALTER TABLE public.admin_action_logs
      ADD CONSTRAINT admin_action_logs_action_type_check CHECK (
        action_type IN (
          'payment_verified',
          'payment_rejected',
          'payment_marked_cod',
          'delivery_status_changed',
          'payment_status_changed',
          'order_cancelled',
          'late_order_approved',
          'late_order_rejected',
          'order_note_updated',
          'zone_updated',
          'menu_updated',
          'payment_settings_updated'
        )
      );
  END IF;
END $$;
