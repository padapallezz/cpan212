import BepListPage from "./pages/BepListPage";
import BepAddPage from "./pages/BepAddPage";
import BepEditPage from "./pages/BepEditPage";
import ForecastListPage from "./pages/ForecastListPage";
import ForecastAddPage from "./pages/ForecastAddPage";
import ForecastEditPage from "./pages/ForecastEditPage";
import RevenueListPage from "./pages/RevenueListPage";
import RevenueAddPage from "./pages/RevenueAddPage";
import RevenueEditPage from "./pages/RevenueEditPage";
import WhatIfListPage from "./pages/WhatIfListPage";
import WhatIfAddPage from "./pages/WhatIfAddPage";
import WhatIfEditPage from "./pages/WhatIfEditPage";

import Home from "./pages/Home";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bep" element={<BepListPage />} />
        <Route path="/bep/add" element={<BepAddPage />} />
        <Route path="/bep/edit/:id" element={<BepEditPage />} />
      </Routes>
    </Router>
  );
}

export default App;


