import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home         from './pages/Home'
import Team         from './pages/Team'
import Events       from './pages/Events'
import Resources    from './pages/Resources'
import ResourcePost from './pages/ResourcePost'
import Highlights   from './pages/Highlights'
import About        from './pages/About'
import NotFound     from './pages/NotFound'

import AdminLayout        from './admin/AdminLayout'
import AdminOverview      from './admin/AdminOverview'
import ManageTeam         from './admin/ManageTeam'
import ManageEvents       from './admin/ManageEvents'
import ManageResources    from './admin/ManageResources'
import ManageAchievements from './admin/ManageAchievements'
import ManageProjects     from './admin/ManageProjects'
import ManageHighlights   from './admin/ManageHighlights'

function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/events"        element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/resources"     element={<PublicLayout><Resources /></PublicLayout>} />
        <Route path="/resources/:id" element={<PublicLayout><ResourcePost /></PublicLayout>} />
        <Route path="/highlights"    element={<PublicLayout><Highlights /></PublicLayout>} />
        <Route path="/team"          element={<PublicLayout><Team /></PublicLayout>} />
        <Route path="/about"         element={<PublicLayout><About /></PublicLayout>} />

        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index               element={<AdminOverview />} />
          <Route path="team"         element={<ManageTeam />} />
          <Route path="events"       element={<ManageEvents />} />
          <Route path="resources"    element={<ManageResources />} />
          <Route path="achievements" element={<ManageAchievements />} />
          <Route path="projects"     element={<ManageProjects />} />
          <Route path="highlights"   element={<ManageHighlights />} />
        </Route>

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  )
}