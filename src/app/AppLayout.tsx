import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { DataroomSidebar } from '@/features/datarooms/components/DataroomSidebar'
import { TopNavBar } from './TopNavBar'

export function AppLayout() {
  const { dataroomId } = useParams<{ dataroomId: string }>()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (!dataroomId) return null

  return (
    <div className="bg-background flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <DataroomSidebar
        activeDataroomId={dataroomId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  )
}
