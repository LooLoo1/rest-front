import { useEffect, useRef, useState } from "react";
import { chatService, type Message } from "../services/llm/chatService";
import FloatingButton from "./LLM/FloatingButton";
import ChatWindow from "./LLM/ChatWindow";

const LLM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement>(null!);  
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    chatService.getHistory().then((history) => setHistory(history));
  }, []);

  useEffect(() => {
    if (open) {
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [history, open]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updated = [...history, { from: "user" as const, text: message }];
    setHistory(updated);
    setMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await chatService.sendMessageToAI(message);
      const updatedWithAI = [
        ...updated,
        { from: "ai" as const, text: aiResponse },
      ];
      setHistory(updatedWithAI);
      chatService.saveHistory(updatedWithAI);
    } catch {
      const errorMsg = {
        from: "ai" as const,
        text: "❌ Error while connecting to AI.",
      };
      const fallback = [...updated, errorMsg];
      setHistory(fallback);
      chatService.saveHistory(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    chatService.clearHistory();
    setHistory([]);
  };

  const handleFloatingButtonClick = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setButtonPosition({ x: rect.right, y: rect.bottom }); // Use bottom-right corner
    setOpen(true);
  };

  return (
    <>
      {!open && <FloatingButton onClick={handleFloatingButtonClick} />}
      {open && (
        <ChatWindow
          isLoading={isLoading}
          onClose={() => setOpen(false)}
          onClear={clear}
          onSend={sendMessage}
          messages={history}
          input={message}
          setInput={setMessage}
          containerRef={containerRef}
          initialPosition={buttonPosition}
        />
      )}
    </>
  );
};

export default LLM;
