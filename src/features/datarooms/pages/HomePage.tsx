import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDatarooms } from '../hooks/useDatarooms'
import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateDataroomDialog } from '../components/CreateDataroomDialog'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AppLogo } from '@/components/shared/AppLogo'
import { useIsDesktop } from '@/hooks/useMediaQuery'

export function HomePage() {
  const { data: datarooms, isLoading } = useDatarooms()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (datarooms && datarooms.length) {
      navigate(`/dataroom/${datarooms[0].id}`)
    }
  }, [datarooms, navigate, isDesktop])

  if (!isLoading && (!datarooms || !datarooms.length)) {
    return (
      <div className="bg-background flex h-screen flex-col items-center justify-center gap-4 px-4 md:gap-6">
        <AppLogo size="lg" />
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">Welcome to Dataroom Manager</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create your first dataroom to get started
          </p>
        </div>
        <Button size="lg" onClick={() => setShowCreate(true)} className="gap-2">
          <FolderPlus className="h-4 w-4 md:h-5 md:w-5" />
          Create Dataroom
        </Button>

        <CreateDataroomDialog open={showCreate} onOpenChange={setShowCreate} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
}
