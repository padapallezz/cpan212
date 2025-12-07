import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWithSidebar from "./Layout";

// Home
import HomePage from "./pages/Home";

// BEP
import BepListPage from "./pages/BepListPage";
import BepEditPage from "./pages/BepEditPage";

// Forecast
import ForecastListPage from "./pages/ForecastListPage";
import ForecastAddPage from "./pages/ForecastAddPage";
import ForecastEditPage from "./pages/ForecastEditPage";

// Revenue
import RevenueListPage from "./pages/RevenueListPage";
import RevenueAddPage from "./pages/RevenueAddPage";
import RevenueEditPage from "./pages/RevenueEditPage";

// What-If
import WhatIfListPage from "./pages/WhatIfListPage";
import WhatIfAddPage from "./pages/WhatIfAddPage";
import WhatIfEditPage from "./pages/WhatIfEditPage";
import BepPage from "./pages/BepPage";

function App() {
  return (
    <Router>
      <LayoutWithSidebar>
      <Routes>
       
        <Route path="/" element={<HomePage />} />

        <Route path="/bep" element={<BepPage />} />
        <Route path="/bep_list" element={<BepListPage />} />

        
        <Route path="/bep/edit/:id" element={<BepEditPage />} />

      
        <Route path="/forecast" element={<ForecastListPage />} />
        <Route path="/forecast/add" element={<ForecastAddPage />} />
        <Route path="/forecast/edit/:id" element={<ForecastEditPage />} />


        <Route path="/revenue" element={<RevenueListPage />} />
        <Route path="/revenue/add" element={<RevenueAddPage />} />
        <Route path="/revenue/edit/:id" element={<RevenueEditPage />} />

       
        <Route path="/whatif" element={<WhatIfListPage />} />
        <Route path="/whatif/add" element={<WhatIfAddPage />} />
        <Route path="/whatif/edit/:id" element={<WhatIfEditPage />} />
      </Routes>
      </LayoutWithSidebar>
    </Router>
  );
}

export default App;

