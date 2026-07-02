-- Admin action audit logs for operational traceability.
CREATE TABLE IF NOT EXISTS public.admin_action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  old_value jsonb,
  new_value jsonb,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_action_logs_action_type_check CHECK (
    action_type IN (
      'payment_verified','payment_rejected','payment_marked_cod','delivery_status_changed',
      'payment_status_changed','order_cancelled','late_order_approved','late_order_rejected',
      'order_note_updated','zone_updated','menu_updated','payment_settings_updated'
    )
  )
);

CREATE INDEX IF NOT EXISTS admin_action_logs_order_id_created_at_idx ON public.admin_action_logs (order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS admin_action_logs_entity_idx ON public.admin_action_logs (entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS admin_action_logs_admin_user_id_idx ON public.admin_action_logs (admin_user_id);

GRANT SELECT, INSERT ON public.admin_action_logs TO authenticated;
GRANT ALL ON public.admin_action_logs TO service_role;

ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs" ON public.admin_action_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert audit logs" ON public.admin_action_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    AND (admin_user_id IS NULL OR admin_user_id = auth.uid())
  );

-- Admin-managed manual UPI payment settings.
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
  ON public.payment_settings (is_active) WHERE is_active = true;

GRANT SELECT ON public.payment_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.payment_settings TO authenticated;
GRANT ALL ON public.payment_settings TO service_role;

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active payment settings" ON public.payment_settings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage payment settings" ON public.payment_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON public.payment_settings;
CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.payment_settings (
  upi_id, payee_name, payment_instructions, screenshot_instructions,
  transaction_id_required, upi_enabled, is_active
)
VALUES (
  'your-upi-id@bank', 'Maa Jaisa Tiffin',
  'Razorpay/payment gateway use nahi ho raha hai. Aap direct UPI QR se payment karenge. Payment ke baad screenshot WhatsApp par bhejna zaroori hai. Admin payment verify karne ke baad order confirm karega.',
  'Payment complete karne ke baad screenshot WhatsApp par bhejein. Admin verify hone ke baad order confirm hoga.',
  false, true, true
)
ON CONFLICT DO NOTHING;