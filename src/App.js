import './App.css';

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Home,VideoAppX,Test,Mesajes,Conferencia,VideoAudioSettings,VideoRecorder,RespuestaList,Dashboard,CreateVideo,VideoApp,VideoConference,UploadExcel,VideoList,LoginForm,SignUpForm } from './pages';

function App() {
  return (
    <div className="App">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mensajes" element={<Mesajes />} />
              <Route path="/conferencia" element={<Conferencia />} />
              <Route path="/test" element={<Test />} />
              <Route path="/videosettings" element={<VideoAudioSettings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/createvideo" element={<CreateVideo />} />
              <Route path="/dashboard/videoConference" element={<VideoConference />} />
              <Route path="/dashboard/subidafile" element={<UploadExcel />} />
              <Route path="/dashboard/videolist" element={<VideoList />} />
              <Route path="/dashboard/respuestas/:id" element={<RespuestaList />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/app/*" element={<VideoApp />} />
            </Routes>
          </AuthProvider>
        </Router>
    </div>
  );
}

export default App;
