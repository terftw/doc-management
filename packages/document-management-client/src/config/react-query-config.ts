/* 
We allow the usage of any here to speed up dev time
Flexible inputs and outputs  
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultOptions, UseMutationOptions } from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 1000 * 60 * 5,
  },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (..._args: any) => Promise<any>> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<T extends (..._args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (..._args: any) => Promise<any>> =
  UseMutationOptions<ApiFnReturnType<MutationFnType>, Error, Parameters<MutationFnType>[0]>;
