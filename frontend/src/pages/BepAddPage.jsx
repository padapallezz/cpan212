import React from "react";
import { useNavigate } from "react-router-dom";
import BepForm from "../components/Bep/BepForm";

const BepAddPage = () => {
  const navigate = useNavigate();

  const handleCreate = (data) => {
    console.log("Creating BEP:", data);
    alert(`Created: ${JSON.stringify(data)}`);
    navigate("/bep"); //back to Beplist
  };

  return <BepForm onSubmit={handleCreate} />;
};

export default BepAddPage;
