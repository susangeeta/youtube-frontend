import { Route, Routes } from "react-router-dom";
import ChannelPage from "./pages/ChannelPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayerPage from "./pages/VideoPlayerPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoPlayerPage />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
