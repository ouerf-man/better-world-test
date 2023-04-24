import { TextField } from "@mui/material";
import { INetwork } from "../interfaces/INetwork";
import { useState } from "react";
import axios from "axios";

function NetworkForm() {
  const handleNewNetworkChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewNetwork({
      ...newNetwork,
      [event.target.name]: event.target.value,
    });
  };
  const [newNetwork, setNewNetwork] = useState<INetwork>({
    name: "",
    company: "",
    city: "",
    country: "",
  });
  const handleNewNetworkSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post<INetwork>("http://localhost:8080/networks", newNetwork)
      .then((res) => {
            alert('Network submitted!')
      })
      .catch((err) => console.error(err));
  };
  return (
    <form onSubmit={handleNewNetworkSubmit}>
      <TextField
        name="name"
        label="Name"
        variant="outlined"
        value={newNetwork.name}
        onChange={handleNewNetworkChange}
      />
      <TextField
        name="company"
        label="Company"
        variant="outlined"
        value={newNetwork.company}
        onChange={handleNewNetworkChange}
      />
      <TextField
        name="city"
        label="City"
        variant="outlined"
        value={newNetwork.city}
        onChange={handleNewNetworkChange}
      />
      <TextField
        name="country"
        label="Country"
        variant="outlined"
        value={newNetwork.country}
        onChange={handleNewNetworkChange}
      />
      <button>Submit</button>
    </form>
  );
}

export default NetworkForm;