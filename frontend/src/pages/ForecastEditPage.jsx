// src/pages/ForecastEditPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ForecastForm from "../components/Forecast/ForecastForm";
import { forecastDummy } from "../data/forecastDummy";

const ForecastEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forecasts, setForecasts] = useState(forecastDummy);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const f = forecasts.find(f => f.id === parseInt(id));
    if (f) setCurrent(f);
  }, [id, forecasts]);

  const handleEdit = (updated) => {
    setForecasts(forecasts.map(f => (f.id === parseInt(id) ? { ...f, ...updated } : f)));
    navigate("/forecast");
  };

  return (
    <div>
      <h1>Edit Forecast</h1>
      {current && <ForecastForm initialData={current} onSubmit={handleEdit} />}
    </div>
  );
};

export default ForecastEditPage;
