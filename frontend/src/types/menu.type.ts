export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  image?: string;
  status: "active" | "inactive";
  popular?: boolean;
}
