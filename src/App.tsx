import React, { useEffect, useState } from "react";
import Sidebar, { PageKey } from "./components/Sidebar";
import { StoreProvider } from "./data/store";
import Dashboard from "./pages/Dashboard";
import AddMatch from "./pages/AddMatch";
import Matches from "./pages/Matches";
import Analytics from "./pages/Analytics";
import Counters from "./pages/Counters";
import Settings from "./pages/Settings";

const getInitialPage = (): PageKey => {
  const hash = window.location.hash.replace("#", "");
  const pages: PageKey[] = ["dashboard", "add", "matches", "analytics", "counters", "settings"];
  if (pages.includes(hash as PageKey)) {
    return hash as PageKey;
  }
  return "dashboard";
};

const App: React.FC = () => {
  const [page, setPage] = useState<PageKey>(getInitialPage);

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  return (
    <StoreProvider>
      <div className="app">
        <Sidebar current={page} onNavigate={setPage} />
        <main className="content">
          {page === "dashboard" && <Dashboard onNavigate={setPage} />}
          {page === "add" && <AddMatch onNavigate={setPage} />}
          {page === "matches" && <Matches onNavigate={setPage} />}
          {page === "analytics" && <Analytics />}
          {page === "counters" && <Counters />}
          {page === "settings" && <Settings />}
        </main>
      </div>
    </StoreProvider>
  );
};

export default App;
