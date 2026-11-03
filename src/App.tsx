import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { Browse } from "./pages/Browse";
import { Give } from "./pages/Give";
import { Giveaway } from "./pages/Giveaway";
import { ItemDetails } from "./pages/ItemDetails";
import { Messages } from "./pages/Messages";
import { MyItems } from "./pages/MyItems";
import { Placeholder } from "./pages/Placeholder";
import { AppProviders } from "./state";

/** Mobile root screens get the bottom nav; detail screens use a back bar instead. */
const ROOT_PATHS = ["/", "/my-items", "/messages", "/profile"];

export function App() {
  const { pathname } = useLocation();
  const isRoot = ROOT_PATHS.includes(pathname);

  return (
    <AppProviders>
      <div className={`app ${isRoot ? "app--with-tabs" : ""}`}>
        <Header />
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/giving/:id" element={<Giveaway />} />
          <Route path="/give" element={<Give />} />
          <Route path="/profile" element={<Placeholder title="Profile" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {isRoot && <BottomNav />}
      </div>
    </AppProviders>
  );
}
