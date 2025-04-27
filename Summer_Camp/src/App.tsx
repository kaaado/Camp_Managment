import "./App.css";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./routes/AdminPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/log-in" element={<AdminPage />} />
      <Route path="/sign-up" element={<AdminPage />} />
      <Route path="/" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
