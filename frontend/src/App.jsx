import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWithSidebar from "./Layout";

// Home
import HomePage from "./pages/Home";

// BEP
import BepListPage from "./pages/BepListPage";
import BepDetailPage from "./pages/BepDetailPage";

// Forecast
import ForecastListPage from "./pages/ForecastListPage";
import ForecastAddPage from "./pages/ForecastAddPage";
import ForecastEditPage from "./pages/RevenuePage";

// Revenue
import RevenuePage from "./pages/RevenuePage";
import RevenueDetailsPage from "./pages/RevenueDetailPage";
import RevenueListPage from "./pages/RevenueListPage";

// What-If
import WhatIfPage from "./pages/WhatIfPage";
import WhatIfAddPage from "./pages/WhatIfPage";
import BepPage from "./pages/BepPage";

function App() {
  return (
    <Router>
      <LayoutWithSidebar>
      <Routes>
       
        <Route path="/" element={<HomePage />} />

        <Route path="/bep" element={<BepPage />} />
        <Route path="/bep_list" element={<BepListPage />} />
        <Route path="/bep/:id" element={<BepDetailPage />} />


      
        <Route path="/forecast" element={<ForecastListPage />} />
        <Route path="/forecast/add" element={<ForecastAddPage />} />
        <Route path="/forecast/edit/:id" element={<ForecastEditPage />} />


        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/revenue/:year/:month" element={<RevenueDetailsPage />} />
        <Route path="/all_revenues" element={<RevenueListPage />} />



       
        <Route path="/whatif" element={<WhatIfPage />} />
        <Route path="/whatif/add" element={<WhatIfAddPage />} />
      </Routes>
      </LayoutWithSidebar>
    </Router>
  );
}

export default App;

