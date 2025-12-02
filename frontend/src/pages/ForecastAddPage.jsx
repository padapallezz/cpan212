
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForecastForm from "../components/Forecast/ForecastForm";
import { forecastDummy } from "../data/forecastDummy";

const ForecastAddPage = () => {
  const [forecasts, setForecasts] = useState(forecastDummy);
  const navigate = useNavigate();

  const handleAdd = (newForecast) => {
    newForecast.id = forecasts.length + 1;
    setForecasts([...forecasts, newForecast]);
    navigate("/forecast");
  };

  return (
    <div>
      <h1>Add Forecast</h1>
      <ForecastForm onSubmit={handleAdd} />
    </div>
  );
};

export default ForecastAddPage;
