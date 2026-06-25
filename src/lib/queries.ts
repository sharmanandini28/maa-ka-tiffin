import { queryOptions } from "@tanstack/react-query";
import { getActivePaymentSettings, getPlans, getWeekMenu, getZones } from "./public.functions";

export const plansQueryOptions = queryOptions({
  queryKey: ["plans"],
  queryFn: () => getPlans(),
  staleTime: 5 * 60_000,
});

export const weekMenuQueryOptions = queryOptions({
  queryKey: ["week-menu"],
  queryFn: () => getWeekMenu(),
  staleTime: 5 * 60_000,
});

export const zonesQueryOptions = queryOptions({
  queryKey: ["zones"],
  queryFn: () => getZones(),
  staleTime: 5 * 60_000,
});

export const paymentSettingsQueryOptions = queryOptions({
  queryKey: ["payment-settings", "active"],
  queryFn: () => getActivePaymentSettings(),
  staleTime: 60_000,
});
