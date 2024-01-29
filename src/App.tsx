import { v4 as uuid } from "uuid";
import { useState } from "react";
import { useRef } from "react";

import Button from "Common/button/Button";
import Input from "Components/common/input/Input";
import Title from "Components/common/title/Title";

interface Clothes {
  id: string;
  name: string;
  imgURL: string | null;
  atLaundry: boolean;
}

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [clothes, setClothes] = useState<Clothes[]>([
    {
      id: uuid(),
      name: "pants",
      imgURL: "https://via.placeholder.com/150",
      atLaundry: true,
    },
    {
      id: uuid(),
      name: "shirt",
      imgURL: "https://via.placeholder.com/150",
      atLaundry: true,
    },
    {
      id: uuid(),
      name: "Shocks",
      imgURL: "https://via.placeholder.com/150",
      atLaundry: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    imgURL: null as string | null, // Initialize imgURL as null
    imgFile: null as File | null,
    atLaundry: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newCloth: Clothes = {
      id: uuid(),
      name: formData.name,
      imgURL: formData.imgURL,
      atLaundry: true,
    };
    setClothes([...clothes, newCloth]);
    setFormData({
      name: "",
      imgURL: null, // Reset imgURL to null after submission
      imgFile: null,
      atLaundry: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "imgFile") {
      if (files?.length) {
        setFormData({
          ...formData,
          imgURL: URL.createObjectURL(files[0]), // Use blob URL for uploaded image
          [name]: files[0], // Store the uploaded image file
        });
      } else {
        setFormData({
          ...formData,
          imgURL: null, // Reset imgURL to null when no image is selected
          [name]: null,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSwitchStatus = (id: string) => {
    setClothes((prevClothes) => {
      return prevClothes.map((cloth) => {
        if (cloth.id === id) {
          return { ...cloth, atLaundry: !cloth.atLaundry };
        }
        return cloth;
      });
    });
  };

  return (
    <>
      <Title title="Cloth Details:" />
      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          name="name"
          label="Name:"
          value={formData.name}
          onChange={handleInputChange}
        />

        <Input
          forwardRef={fileInputRef}
          id="imgFile"
          type="file"
          name="imgFile"
          label="Upload Image:"
          accept="image/*"
          onChange={handleInputChange}
        />
        <Button type="submit">Send to Laundry</Button>
      </form>
      <ClothesStatusList
        mappingArray={clothes}
        atLaundry={true} // Display clothes at laundry
        handleSwitchStatus={handleSwitchStatus} // Pass handleSwitchStatus
      />
      <ClothesStatusList
        mappingArray={clothes}
        atLaundry={false} // Display clothes at home
        handleSwitchStatus={handleSwitchStatus} // Pass handleSwitchStatus
      />
    </>
  );
};

export default App;

type ClothesStatusListProps = {
  mappingArray: Clothes[];
  atLaundry?: boolean;
  handleSwitchStatus: (id: string) => void; // Add handleSwitchStatus prop
};

const ClothesStatusList: React.FC<ClothesStatusListProps> = ({
  mappingArray,
  atLaundry = false,
  handleSwitchStatus,
}) => {
  const title = atLaundry ? "At Laundry:" : "At Home:";
  const filteredItems = mappingArray.filter(
    (item) => item.atLaundry === atLaundry
  );
  if (filteredItems.length > 0) {
    return (
      <>
        <Title title={title} />
        {filteredItems.map((filteredItem) => (
          <ClothesStatusCard
            key={filteredItem.id}
            cardItem={filteredItem}
            handleSwitchStatus={handleSwitchStatus} // Pass handleSwitchStatus
          />
        ))}
      </>
    );
  } else {
    // If the length of the filtered array is 0, return null (don't render anything)
    return null;
  }
};

const ClothesStatusCard: React.FC<{
  cardItem: Clothes;
  handleSwitchStatus: (id: string) => void; // Add handleSwitchStatus prop
}> = ({ cardItem, handleSwitchStatus }) => {
  const { id, name, imgURL, atLaundry } = cardItem;

  const toggleClothesLocation = () => handleSwitchStatus(id);

  return (
    <div className="py-3">
      {imgURL && <img src={imgURL} alt={name} width="100%" height="auto" />}
      <div className="flex flex-row my-1">
        <h2 className="font-medium">Name:</h2>
        <span className="text capitalize ml-1"> {name}</span>
      </div>
      <Button onClick={toggleClothesLocation}>
        {atLaundry
          ? "Ah yaar, cloth is at Home"
          : "La mya, cloth is at Laundry"}
      </Button>
    </div>
  );
};