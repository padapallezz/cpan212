import React, { useState, useEffect } from "react";

const WhatIfForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    scenario: "",
    impact: ""
  });

  useEffect(() => { if(initialData) setFormData(initialData); }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.scenario || !formData.impact){
      alert("Please fill all fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="scenario" placeholder="Scenario" value={formData.scenario} onChange={handleChange} />
      <input name="impact" type="number" placeholder="Impact" value={formData.impact} onChange={handleChange} />
      <button type="submit">{initialData ? "Update" : "Create"}</button>
    </form>
  );
};

export default WhatIfForm;
