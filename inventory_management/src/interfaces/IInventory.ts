import { Timestamp } from "firebase/firestore";
interface IInventory {
  id: string;
  name: string;
  quantity: number;
  dateAdded: Timestamp;
  updatedAt: Timestamp | null;
}

export type { IInventory };
