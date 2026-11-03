import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Browse } from "./pages/Browse";
import { ItemDetails } from "./pages/ItemDetails";
import { Messages } from "./pages/Messages";
import { Placeholder } from "./pages/Placeholder";
import { InterestProvider } from "./state";

export function App() {
  return (
    <InterestProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/my-items" element={<Placeholder title="My Items" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </InterestProvider>
  );
}
