import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'

interface MutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>
  invalidateKeys: (variables: TVariables) => Array<unknown[]>
  successMessage?: string | ((data: TData, variables: TVariables) => string)
  errorMessage?: string
}

export function createMutation<TData, TVariables>(
  config: MutationConfig<TData, TVariables>
): () => UseMutationResult<TData, Error, TVariables, unknown> {
  return function useMutationHook() {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: config.mutationFn,
      onSuccess: (data, variables) => {
        // Invalidate all specified query keys
        config.invalidateKeys(variables).forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key })
        })

        // Show success toast
        if (config.successMessage) {
          const message =
            typeof config.successMessage === 'function'
              ? config.successMessage(data, variables)
              : config.successMessage
          toast.success(message)
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || config.errorMessage || 'An error occurred')
      },
    })
  }
}
