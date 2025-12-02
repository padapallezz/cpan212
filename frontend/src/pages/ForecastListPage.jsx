
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forecastDummy } from "../data/forecastDummy";
import ForecastList from "../components/Forecast/ForecastList";

const ForecastListPage = () => {
  const [forecasts, setForecasts] = useState(forecastDummy);

  const handleDelete = (id) => setForecasts(forecasts.filter(f => f.id !== id));

  return (
    <div>
      <h1>Forecast List</h1>
      <Link to="/forecast/add">Add New Forecast</Link>
      <ForecastList forecasts={forecasts} onDelete={handleDelete} />
    </div>
  );
};

export default ForecastListPage;
