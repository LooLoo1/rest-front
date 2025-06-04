import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Message } from "../../services/llm/chatService";

type Props = {
  onClose: () => void;
  onClear: () => void;
  onSend: () => void;
  messages: Message[];
  input: string;
  isLoading: boolean;
  setInput: (val: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  initialPosition: { x: number; y: number };
};

const ChatWindow = ({
  onClose,
  onClear,
  onSend,
  messages,
  input,
  setInput,
  isLoading,
  containerRef,
  initialPosition,
}: Props) => (
<div 
  className="fixed w-96 h-[70vh] flex flex-col rounded-3xl bg-[#1e1e1e]/80 backdrop-blur-md shadow-2xl border border-white/10 z-50 min-w-[300px] min-h-[400px] max-h-[95vh] max-w-[95vw]"
  style={{ 
    resize: 'both',
    overflow: 'auto', // Ensure resizing works
    touchAction: 'none',
    left: `${initialPosition.x - 384}px`, // Adjust for width (96 * 4 = 384px)
    top: `${initialPosition.y - (0.7 * window.innerHeight)}px`, // Adjust for height (70vh)
  }}
>
    <div
      className="flex justify-between items-center px-5 py-3 bg-[#DCB73C] rounded-t-3xl text-black font-bold text-lg cursor-move"
      onMouseDown={(e) => {
        const el = e.currentTarget.parentElement!;
        const rect = el.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const onMouseMove = (e: MouseEvent) => {
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }}
    >
      <span>🤖 AI Support</span>
      <div className="flex gap-3">
        <DeleteIcon
          onClick={onClear}
          className="cursor-pointer hover:text-white transition"
        />
        <CloseIcon
          onClick={() => onClose()}
          className="cursor-pointer hover:text-white transition"
        />
      </div>
    </div>
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-white bg-black/30"
    >
      <MessageList messages={messages} isLoading={isLoading} />
    </div>
    <ChatInput
      message={input}
      setMessage={setInput}
      onSend={onSend}
      isLoading={isLoading}
    />
  </div>
);

export default ChatWindow;
