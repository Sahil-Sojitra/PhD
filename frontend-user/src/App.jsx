import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandscapeEnforcer from './components/LandscapeEnforcer'
import ProtectedRoute from './components/ProtectedRoute'
import DemoPage from './pages/DemoPage'
import FinalPage from './pages/FinalPage'
import InstructionsPage from './pages/InstructionsPage'
import ParticipantFormPage from './pages/ParticipantFormPage'
import ResultPage from './pages/ResultPage'
import TrialPage from './pages/TrialPage'

function App() {
  return (
    <BrowserRouter>
      <LandscapeEnforcer />
      <Routes>
        <Route path="/" element={<ParticipantFormPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/trial" element={<TrialPage />} />
          <Route path="/final" element={<FinalPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
