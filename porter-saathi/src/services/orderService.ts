// src/services/orderService.ts
export interface Order {
    _id: string;
    trackingId: string;
    customerName?: string;
    items?: string[];
    address?: string;
    status?: "Processing" | "Shipped" | "Delivered" | string;
    pickupTime?: string;
    assignedTo?: string;
  }
  
  export async function trackOrder(trackingId: string): Promise<Order> {
    const res = await fetch(`/api/orders/track/${trackingId}`);
    if (!res.ok) throw new Error("Order not found");
    return res.json();
  }
  
  export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  }
  
  export async function deleteOrder(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    return res.json();
  }
  