-- Admin action audit logs for operational traceability.
-- Additive only: does not change existing order/payment behavior.

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
      'menu_updated'
    )
  )
);

CREATE INDEX IF NOT EXISTS admin_action_logs_order_id_created_at_idx
  ON public.admin_action_logs (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS admin_action_logs_entity_idx
  ON public.admin_action_logs (entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS admin_action_logs_admin_user_id_idx
  ON public.admin_action_logs (admin_user_id);

GRANT SELECT, INSERT ON public.admin_action_logs TO authenticated;
GRANT ALL ON public.admin_action_logs TO service_role;

ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
  ON public.admin_action_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert audit logs"
  ON public.admin_action_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    AND (admin_user_id IS NULL OR admin_user_id = auth.uid())
  );
