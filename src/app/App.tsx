import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import { AppLayout } from './AppLayout'
import { DataroomPage } from '@/features/explorer/pages/DataroomPage'
import { HomePage } from '@/features/datarooms/pages/HomePage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dataroom/:dataroomId" element={<AppLayout />}>
              <Route index element={<DataroomPage />} />
              <Route path="folder/:folderId" element={<DataroomPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProtectedRoute>
      </BrowserRouter>
      <Toaster position="bottom-center" theme="dark" />
    </Providers>
  )
}

export default App
