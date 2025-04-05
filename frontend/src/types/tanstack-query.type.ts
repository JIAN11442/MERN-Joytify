import { UseQueryOptions, UseSuspenseQueryOptions } from "@tanstack/react-query";

export type SuspenseQueryOptions<T> = Omit<UseSuspenseQueryOptions<T>, "queryKey" | "queryFn">;
export type QueryOptions<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;
