"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEventHandler,
  ChangeEvent,
} from "react";
import { useInventory } from "@/hooks";
import Image from "next/image";
import {
  Box,
  Stack,
  Typography,
  Modal,
  FormLabel,
  TextField,
  CardContent,
  Button,
  Card,
  ModalRoot,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { query, getDocs, collection } from "firebase/firestore";
import { db } from "@/setup";
import { IInventory } from "@/interfaces";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "gray",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
}));

const CustomInputField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "gray",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused": {
      outline: "none",
      boxShadow: "none",
    },
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function InventoryWelcome() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({ name: "", quantity: "" });
  const { addItem, removeItem, decreaseQuantity, increaseQuantity } =
    useInventory();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = useCallback(async () => {
    const snapshot = query(collection(db, "inventory"));
    const docs = await getDocs(snapshot);
    let inventoryList: any = [];
    docs.forEach((doc) => {
      inventoryList.push({ ...doc.data() });
    });

    if (searchTerm) {
      inventoryList = inventoryList.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setInventory(inventoryList);
  }, [searchTerm]);

  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem((prevData) => ({
      ...prevData,
      [name]: name === "quantity" ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<IInventory> = {
      name: item.name,
      quantity: parseInt(item.quantity) || 0,
    };
    try {
      await addItem(payload);
      console.log(payload);
      setItem({ name: "", quantity: "" });
      handleClose();
      updateInventory();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleRemove = async (name: string) => {
    try {
      await removeItem(name);
      updateInventory();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleDecrease = async (name: string) => {
    try {
      await decreaseQuantity(name);
      updateInventory();
    } catch (err: any) {
      console.error("Error decreasing quantity:", err);
    }
  };

  const handleIncrease = async (name: string) => {
    try {
      await increaseQuantity(name);
      updateInventory();
    } catch (err: any) {
      console.error("Error increasing quantity:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    const filtered = inventory.filter((item) => {
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    console.log(filtered);
    return filtered;
  }, [searchTerm, inventory]);

  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <div className="w-full">
          <form>
            <div className="flex flex-row items-center">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <CustomInputField
                type="search"
                placeholder="Item Name"
                className="w-full bg-background shadow-none appearance-none md:w-2/3 lg:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputLabelProps={{
                  style: { color: "gray" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
              />
            </div>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <Typography variant="h4">Inventory</Typography>
          <Button
            size="small"
            variant="outlined"
            className="ml-auto h-8 gap-1"
            onClick={handleOpen}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {inventory.map(({ name, id, quantity }) => (
            <Card
              key={id}
              className="relative group flex flex-col items-center justify-center"
            >
              <div className="flex h-40">
                <Image
                  loader={({ src }) => src}
                  src={`https://via.placeholder.com/200x200.png?text=${encodeURIComponent(
                    name
                  )}`}
                  alt={name}
                  width={200}
                  height={200}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <CardContent className="flex flex-col justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleDecrease(name)}
                    >
                      <MinusIcon className="h-4 w-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span>{quantity} in stock</span>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleIncrease(name)}
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleRemove(name)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style} className="rounded-xl bg-slate-900">
            <Typography variant="h4" className="text-white">
              Add New Product
            </Typography>
            <div className="px-4 sm:px-6">
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <FormLabel htmlFor="name" className="text-white">
                    Name
                  </FormLabel>
                  <CustomTextField
                    id="name"
                    type="text"
                    name="name"
                    required={true}
                    placeholder="Item Name"
                    value={item.name}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: "gray" },
                    }}
                    InputProps={{
                      style: { color: "white" },
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="quantity" className="text-white">
                    Quantity
                  </FormLabel>
                  <CustomTextField
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    placeholder="Item Quantity"
                    inputProps={{ min: 0 }}
                    required={true}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: "gray" },
                    }}
                    InputProps={{
                      style: { color: "white" },
                    }}
                  />
                </div>
              </form>
            </div>
            <div className="px-4 sm:px-6">
              <Button
                variant="outlined"
                onClick={() => setOpen(false)}
                sx={{ color: "white", borderColor: "white", marginRight: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{ backgroundColor: "white", color: "black" }}
              >
                Save
              </Button>
            </div>
          </Box>
        </Modal>
      </main>
    </div>
  );
}

function MinusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
