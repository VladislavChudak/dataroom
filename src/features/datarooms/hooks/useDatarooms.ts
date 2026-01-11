import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { repository } from '@/repo/indexedDbRepo'
import { toast } from 'sonner'

export function useDatarooms() {
  return useQuery({
    queryKey: ['datarooms'],
    queryFn: () => repository.listDatarooms(),
  })
}

export function useGetDataroomById(id: string) {
  return useQuery({
    queryKey: ['dataroom', id],
    queryFn: () => repository.getDataroomById(id),
  })
}

export function useCreateDataroom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => repository.createDataroom(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datarooms'] })
      toast.success('Dataroom created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create dataroom')
    },
  })
}

export function useDeleteDataroom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => repository.deleteDataroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datarooms'] })
      toast.success('Dataroom deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete dataroom')
    },
  })
}
