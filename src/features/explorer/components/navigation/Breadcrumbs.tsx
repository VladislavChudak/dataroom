import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useFolderPath } from '../../hooks/useExplorer'
import { useQuery } from '@tanstack/react-query'
import { repository } from '@/repo/indexedDbRepo'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbsProps {
  dataroomId: string
  folderId: string
}

export function Breadcrumbs({ dataroomId, folderId }: BreadcrumbsProps) {
  const { data: dataroom } = useQuery({
    queryKey: ['dataroom', dataroomId],
    queryFn: () => repository.getDataroomById(dataroomId),
  })

  const { data: path, isLoading } = useFolderPath(folderId)

  if (isLoading) {
    return (
      <div className="border-border flex h-12 items-center border-b px-3 md:h-14 md:px-6">
        <Skeleton className="h-5 w-48 md:h-6 md:w-64" />
      </div>
    )
  }

  return (
    <div className="border-border flex h-12 items-center justify-between overflow-x-auto border-b px-3 md:h-14 md:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/dataroom/${dataroomId}`} className="text-sm hover:underline md:text-base">
                {dataroom?.name || 'My Drive'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {path &&
            path.length > 1 &&
            path.slice(1).map((folder) => (
              <span key={folder.id} className="flex items-center gap-1 md:gap-2">
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to={`/dataroom/${dataroomId}/folder/${folder.id}`}
                      className="inline-block max-w-[120px] truncate text-sm hover:underline md:max-w-[200px] md:text-base"
                    >
                      {folder.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </span>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
