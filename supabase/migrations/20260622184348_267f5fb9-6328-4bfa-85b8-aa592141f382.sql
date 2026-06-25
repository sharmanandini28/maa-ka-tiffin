-- ===== Enums =====
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.meal_type AS ENUM ('lunch', 'dinner');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'partial', 'refunded', 'failed', 'cod');
CREATE TYPE public.delivery_status AS ENUM ('received', 'confirmed', 'cooking', 'packed', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE public.payment_mode AS ENUM ('upi', 'cod');

-- ===== user_roles =====
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ===== shared updated_at trigger =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ===== plans =====
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL,
  price integer NOT NULL,
  period text NOT NULL DEFAULT '/ 28 Days',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  roti_qty integer NOT NULL DEFAULT 4,
  rice_qty integer NOT NULL DEFAULT 1,
  dal_qty integer NOT NULL DEFAULT 1,
  sabzi_qty integer NOT NULL DEFAULT 1,
  is_popular boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== menu_items =====
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_date date NOT NULL,
  meal meal_type NOT NULL,
  weekday integer,
  dishes text NOT NULL,
  descriptor text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (menu_date, meal)
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view menu" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage menu" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== orders =====
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  mobile text NOT NULL,
  email text,
  meal meal_type NOT NULL,
  delivery_date date NOT NULL,
  plan_slug text NOT NULL,
  plan_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  add_ons jsonb NOT NULL DEFAULT '[]'::jsonb,
  spice_pref text NOT NULL DEFAULT 'normal',
  rice_pref boolean NOT NULL DEFAULT true,
  extra_roti integer NOT NULL DEFAULT 0,
  address text NOT NULL,
  landmark text,
  sector text NOT NULL,
  maps_link text,
  payment_mode payment_mode NOT NULL DEFAULT 'upi',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  delivery_state delivery_status NOT NULL DEFAULT 'received',
  special_note text,
  total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- Orders are created server-side via service role; admins manage via dashboard.
CREATE POLICY "Admins can view orders" ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== seed plans =====
INSERT INTO public.plans (slug, name, tagline, price, items, roti_qty, rice_qty, dal_qty, sabzi_qty, is_popular, sort_order) VALUES
('basic', 'Basic', 'Everyday & Essential', 4799,
  '["Lunch","Dinner","Roti","Seasonal Sabzi","Dal","Rice","Salad"]'::jsonb, 4, 1, 1, 1, false, 1),
('standard', 'Standard', 'Most Popular', 5999,
  '["Lunch","Dinner","Roti","2 Seasonal Sabzi","Dal","Rice","Salad","Curd / Chaas"]'::jsonb, 4, 1, 1, 2, true, 2),
('premium', 'Premium', 'Extra Comfort', 6999,
  '["Lunch","Dinner","Roti","2 Seasonal Sabzi","Dal","Rice / Pulao","Salad","Curd / Chaas","Sweet (2 times a week)"]'::jsonb, 5, 1, 1, 2, false, 3);

-- ===== seed weekly menu (rolling 7 days from today) =====
INSERT INTO public.menu_items (menu_date, meal, weekday, dishes, descriptor)
SELECT
  d::date,
  m.meal,
  EXTRACT(DOW FROM d)::int,
  CASE WHEN m.meal = 'lunch' THEN lunch ELSE dinner END,
  CASE WHEN m.meal = 'lunch' THEN ldesc ELSE ddesc END
FROM (
  SELECT generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '6 days', INTERVAL '1 day') AS d
) days
CROSS JOIN (VALUES ('lunch'::meal_type), ('dinner'::meal_type)) AS m(meal)
JOIN (
  VALUES
    (0, 'Chole, Jeera Rice, Roti, Salad', 'Sunday Special', 'Paneer Bhurji, Dal, Roti', 'Wholesome & Satisfying'),
    (1, 'Dal Tadka, Mix Veg, Rice, Roti, Curd', 'Comforting & Balanced', 'Kadhi, Rice, Roti, Salad', 'Light & Homely'),
    (2, 'Rajma, Rice, Roti, Salad', 'Protein Rich', 'Mix Veg, Dal, Roti', 'Simple & Fresh'),
    (3, 'Chole, Rice, Roti, Salad', 'Hearty & Filling', 'Seasonal Sabzi, Dal, Roti', 'Light & Homely'),
    (4, 'Dal Tadka, Bhindi, Rice, Roti', 'Comforting & Balanced', 'Aloo Matar, Roti, Salad', 'Simple & Fresh'),
    (5, 'Kadhi Rice, Sabzi, Roti', 'Tangy & Comforting', 'Dal, Seasonal Sabzi, Roti', 'Light & Homely'),
    (6, 'Special Veg Thali', 'Saturday Feast', 'Peas Pulao, Rajma, Roti, Curd', 'Wholesome & Satisfying')
) AS menu(dow, lunch, ldesc, dinner, ddesc)
  ON menu.dow = EXTRACT(DOW FROM d)::int;