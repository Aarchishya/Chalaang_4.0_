export interface AIResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface CommandRequest {
    command: string;
    userId: string;
}

// server/src/types/index.ts
export type AiAction =
  | "created_order"
  | "track_order"
  | "order_not_found"
  | "next_pickup"
  | "no_pickups"
  | "list_orders"
  | "cancel_order"
  | "ask_for_order_id"
  | "ask_for_address"
  | "update_address"
  | "update_order"        // NEW
  | "delete_order"        // NEW
  | "llm_reply"
  | "fallback";

export interface AiResponseBody {
  reply: string;          // human-readable response for chat bubble
  action: AiAction;       // machine-readable action
  order?: any;            // single order (when relevant)
  orders?: any[];         // list (when relevant)
  trackingId?: string;    // when the action relates to an ID
  error?: string;         // optional error message
}
