import { useParams } from "react-router-dom";
import BepForm from "../components/Bep/BepForm";
import {bepDummy} from "../data/bepDummy";

const BepEditPage = () => {
  const { id } = useParams();

  const current = bepDummy.find((item) => item.id === Number(id));


  const handleUpdate = (updatedData) => {
    console.log("Updating BEP:", updatedData);
    // axios.put(`/bep/${id}`, updatedData)
  };

  return (
    <div>
      <BepForm initialData={current} onSubmit={handleUpdate} />
    </div>
  );
};

export default BepEditPage;
