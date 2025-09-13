import React, { useState } from "react";
import { trackOrder, updateOrder, deleteOrder } from "../services/orderService"; 

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

interface Reminder {
  time: string;
  text: string;
}

// helper function to detect trackingId
function extractTrackingId(text: string) {
  const match = text.match(/ORD-[a-zA-Z0-9]+/);
  return match ? match[0] : null;
}

const VoiceInterface: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };

  const sendToAI = async (text: string) => {
    setChatHistory((prev) => [...prev, { role: "user", content: text }]);

    // Check for reminder
    const reminderMatch = text.match(
      /(?:remind(?: me)?|reminder|schedule|pickup).*?(\d{1,2}(?::\d{2})?\s?(?:am|pm))/i
    );
    if (reminderMatch) {
      const time = reminderMatch[1];
      setReminders((prev) => [...prev, { time, text }]);
      const reply = `I'll remind you at ${time}.`;
      setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
      speak(reply);
      return;
    }

    // Extract trackingId
    const trackingId = extractTrackingId(text);

    // ---- UPDATE ORDER ----
    if (
      text.toLowerCase().includes("update") ||
      text.toLowerCase().includes("modify") ||
      text.toLowerCase().includes("change")
    ) {
      if (!trackingId) {
        const reply = "Please provide a valid tracking ID to update an order.";
        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
        return;
      }

      try {
        // Get the order
        const order = await trackOrder(trackingId);
        if (!order || !order._id) {
          const reply = `Sorry, I couldn’t find any order with ID ${trackingId}.`;
          setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
          speak(reply);
          return;
        }

        const lowerText = text.toLowerCase();
        const updates: any = {};

        // ---- Status updates ----
        if (lowerText.includes("delivered")) updates.status = "Delivered";
        if (lowerText.includes("processing")) updates.status = "Processing";
        if (lowerText.includes("shipped")) updates.status = "Shipped";

        // ---- Pickup time ----
        if (lowerText.includes("pickup"))
          updates.pickupTime = new Date().toISOString();

        // ---- Assignee ----
        if (lowerText.includes("assign")) {
          // Try to detect assignee name after 'assign'
          const match = text.match(/assign\s+to\s+([a-zA-Z ]+)/i);
          updates.assignedTo = match ? match[1].trim() : "Priya Sharma";
        }

        // ---- Add items ----
        if (lowerText.includes("add")) {
          const addIndex = lowerText.indexOf("add");
          const itemsText = text.substring(addIndex + 3).trim();
          const itemsToAdd = itemsText.split(/\s*(?:,|and)\s*/).filter(Boolean);
          updates.items = [...(order.items || []), ...itemsToAdd];
        }

        // ---- Remove items ----
        if (lowerText.includes("remove")) {
          const removeIndex = lowerText.indexOf("remove");
          const itemsText = text.substring(removeIndex + 6).trim();
          const itemsToRemove = itemsText
            .split(/\s*(?:,|and)\s*/)
            .filter(Boolean);
          updates.items = (order.items || []).filter(
            (item: string) => !itemsToRemove.includes(item)
          );
        }

        if (Object.keys(updates).length === 0) {
          const reply =
            "What would you like to update? (status, items, pickup time, assignee, etc.)";
          setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
          speak(reply);
          return;
        }

        console.log("Updating order:", order._id, updates);

        const updated = await updateOrder(order._id, updates);

        const reply = `Order ${trackingId} updated successfully.
- Status: ${updated.status || "unchanged"}
- Pickup time: ${updated.pickupTime || "not set"}
- Assigned to: ${updated.assignedTo || "not set"}
- Items: ${updated.items?.join(", ") || "no items"}`;

        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
      } catch (err) {
        console.error(err);
        const reply = `Failed to update order ${trackingId}. Please try again.`;
        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
      }
    }

    // ---- DELETE ORDER ----
    if (
      text.toLowerCase().includes("delete") ||
      text.toLowerCase().includes("cancel")
    ) {
      if (!trackingId) {
        const reply = "Please provide a valid tracking ID to delete an order.";
        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
        return;
      }

      try {
        // First fetch order by trackingId
        const order = await trackOrder(trackingId);

        if (!order || !order._id) {
          const reply = `Sorry, I couldn’t find any order with ID ${trackingId}.`;
          setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
          speak(reply);
          return;
        }

        // Delete using MongoDB _id
        const response = await deleteOrder(order._id);

        const reply = response.success
          ? `Order ${trackingId} has been deleted successfully.`
          : `Failed to delete order ${trackingId}.`;

        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
      } catch (err) {
        console.error(err);
        const reply = `Failed to delete order ${trackingId}. Please try again.`;
        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
      }

      return; // prevent falling into TRACK ORDER block
    }

    // ---- TRACK ORDER ----
    if (trackingId) {
      try {
        const order = await trackOrder(trackingId);
        const reply = `Here are the details for ${trackingId}:\n
- Customer: ${order.customerName || "N/A"}\n
- Items: ${order.item || "N/A"}\n
- Address: ${order.address || "N/A"}\n
- Status: ${order.status || "Processing"}`;


        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
        return;
      } catch (err) {
        const reply = `Sorry, I couldn’t find any order with ID ${trackingId}.`;
        setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
        speak(reply);
        return;
      }
    }

    // Default → send to AI backend
    fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        setChatHistory((prev) => [
          ...prev,
          { role: "ai", content: data.reply },
        ]);
        speak(data.reply);
      });
  };

  const handleListen = () => {
    if (!recognition) return alert("Speech Recognition not supported");
    setListening(true);
    recognition.start();
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      sendToAI(text);
    };
    recognition.onend = () => setListening(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendToAI(textInput.trim());
      setTextInput("");
    }
  };

  return (
    <div>
      <button onClick={handleListen} disabled={listening}>
        {listening ? "Listening..." : "Start Voice Command"}
      </button>
      <form
        onSubmit={handleTextSubmit}
        style={{ display: "inline", marginLeft: "1em" }}
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ marginTop: "1em" }}>
        <div>
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "0.5em" }}>
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
      </div>
      {reminders.length > 0 && (
        <div style={{ marginTop: "1em" }}>
          <h4>Reminders:</h4>
          <ul>
            {reminders.map((rem, idx) => (
              <li key={idx}>
                <strong>{rem.time}</strong>: {rem.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;
