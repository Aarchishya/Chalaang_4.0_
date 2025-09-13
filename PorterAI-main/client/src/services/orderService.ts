import axios from "axios";
const API_URL = "http://localhost:5000/orders";

export const createOrder = async (payload: any) => {
  const res = await axios.post(`${API_URL}/create`, payload);
  return res.data;
};

export const updateOrder = async (id: string, payload: any) => {
  const res = await axios.put(`${API_URL}/modify/${id}`, payload);
  return res.data;
};

export const getOrder = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const deleteOrder = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const listOrders = async () => {
  const res = await axios.get(`${API_URL}/list`);
  return res.data;
};

export const trackOrder = async (trackingId: string) => {
  const res = await axios.get(`${API_URL}/track/${trackingId}`);
  return res.data;
};
