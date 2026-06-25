export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_action_logs: {
        Row: {
          action_type: string;
          admin_user_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          new_value: Json | null;
          note: string | null;
          old_value: Json | null;
          order_id: string | null;
        };
        Insert: {
          action_type: string;
          admin_user_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          new_value?: Json | null;
          note?: string | null;
          old_value?: Json | null;
          order_id?: string | null;
        };
        Update: {
          action_type?: string;
          admin_user_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          new_value?: Json | null;
          note?: string | null;
          old_value?: Json | null;
          order_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admin_action_logs_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      delivery_zones: {
        Row: {
          active: boolean;
          cod_allowed: boolean;
          created_at: string;
          delivery_fee: number;
          id: string;
          meals: string;
          min_qty: number;
          sector: string;
          sort_order: number;
          subscription_only: boolean;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          cod_allowed?: boolean;
          created_at?: string;
          delivery_fee?: number;
          id?: string;
          meals?: string;
          min_qty?: number;
          sector: string;
          sort_order?: number;
          subscription_only?: boolean;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          cod_allowed?: boolean;
          created_at?: string;
          delivery_fee?: number;
          id?: string;
          meals?: string;
          min_qty?: number;
          sector?: string;
          sort_order?: number;
          subscription_only?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      menu_items: {
        Row: {
          created_at: string;
          descriptor: string | null;
          dishes: string;
          id: string;
          meal: Database["public"]["Enums"]["meal_type"];
          menu_date: string;
          updated_at: string;
          weekday: number | null;
        };
        Insert: {
          created_at?: string;
          descriptor?: string | null;
          dishes: string;
          id?: string;
          meal: Database["public"]["Enums"]["meal_type"];
          menu_date: string;
          updated_at?: string;
          weekday?: number | null;
        };
        Update: {
          created_at?: string;
          descriptor?: string | null;
          dishes?: string;
          id?: string;
          meal?: Database["public"]["Enums"]["meal_type"];
          menu_date?: string;
          updated_at?: string;
          weekday?: number | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          add_ons: Json;
          address: string;
          admin_notes: string | null;
          created_at: string;
          customer_name: string;
          delivery_date: string;
          delivery_state: Database["public"]["Enums"]["delivery_status"];
          email: string | null;
          extra_roti: number;
          id: string;
          is_late_request: boolean;
          landmark: string | null;
          maps_link: string | null;
          meal: Database["public"]["Enums"]["meal_type"];
          mobile: string;
          order_code: string;
          payment_mode: Database["public"]["Enums"]["payment_mode"];
          payment_status: Database["public"]["Enums"]["payment_status"];
          plan_name: string;
          plan_slug: string;
          quantity: number;
          rice_pref: boolean;
          sector: string;
          special_note: string | null;
          spice_pref: string;
          total: number;
          updated_at: string;
          upi_txn_id: string | null;
          whatsapp_number: string | null;
        };
        Insert: {
          add_ons?: Json;
          address: string;
          admin_notes?: string | null;
          created_at?: string;
          customer_name: string;
          delivery_date: string;
          delivery_state?: Database["public"]["Enums"]["delivery_status"];
          email?: string | null;
          extra_roti?: number;
          id?: string;
          is_late_request?: boolean;
          landmark?: string | null;
          maps_link?: string | null;
          meal: Database["public"]["Enums"]["meal_type"];
          mobile: string;
          order_code: string;
          payment_mode?: Database["public"]["Enums"]["payment_mode"];
          payment_status?: Database["public"]["Enums"]["payment_status"];
          plan_name: string;
          plan_slug: string;
          quantity?: number;
          rice_pref?: boolean;
          sector: string;
          special_note?: string | null;
          spice_pref?: string;
          total?: number;
          updated_at?: string;
          upi_txn_id?: string | null;
          whatsapp_number?: string | null;
        };
        Update: {
          add_ons?: Json;
          address?: string;
          admin_notes?: string | null;
          created_at?: string;
          customer_name?: string;
          delivery_date?: string;
          delivery_state?: Database["public"]["Enums"]["delivery_status"];
          email?: string | null;
          extra_roti?: number;
          id?: string;
          is_late_request?: boolean;
          landmark?: string | null;
          maps_link?: string | null;
          meal?: Database["public"]["Enums"]["meal_type"];
          mobile?: string;
          order_code?: string;
          payment_mode?: Database["public"]["Enums"]["payment_mode"];
          payment_status?: Database["public"]["Enums"]["payment_status"];
          plan_name?: string;
          plan_slug?: string;
          quantity?: number;
          rice_pref?: boolean;
          sector?: string;
          special_note?: string | null;
          spice_pref?: string;
          total?: number;
          updated_at?: string;
          upi_txn_id?: string | null;
          whatsapp_number?: string | null;
        };
        Relationships: [];
      };
      plans: {
        Row: {
          created_at: string;
          dal_qty: number;
          id: string;
          is_popular: boolean;
          items: Json;
          name: string;
          period: string;
          price: number;
          rice_qty: number;
          roti_qty: number;
          sabzi_qty: number;
          slug: string;
          sort_order: number;
          tagline: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          dal_qty?: number;
          id?: string;
          is_popular?: boolean;
          items?: Json;
          name: string;
          period?: string;
          price: number;
          rice_qty?: number;
          roti_qty?: number;
          sabzi_qty?: number;
          slug: string;
          sort_order?: number;
          tagline: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          dal_qty?: number;
          id?: string;
          is_popular?: boolean;
          items?: Json;
          name?: string;
          period?: string;
          price?: number;
          rice_qty?: number;
          roti_qty?: number;
          sabzi_qty?: number;
          slug?: string;
          sort_order?: number;
          tagline?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
      delivery_status:
        | "received"
        | "confirmed"
        | "cooking"
        | "packed"
        | "out_for_delivery"
        | "delivered"
        | "cancelled";
      meal_type: "lunch" | "dinner";
      payment_mode: "upi" | "cod";
      payment_status: "pending" | "paid" | "partial" | "refunded" | "failed" | "cod";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      delivery_status: [
        "received",
        "confirmed",
        "cooking",
        "packed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      meal_type: ["lunch", "dinner"],
      payment_mode: ["upi", "cod"],
      payment_status: ["pending", "paid", "partial", "refunded", "failed", "cod"],
    },
  },
} as const;
