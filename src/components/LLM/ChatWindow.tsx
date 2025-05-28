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
}: Props) => (
  <div className="fixed bottom-6 right-6 w-96 max-w-[95vw] h-[70vh] flex flex-col rounded-3xl bg-[#1e1e1e]/80 backdrop-blur-md shadow-2xl border border-white/10 z-50">
    <div className="flex justify-between items-center px-5 py-3 bg-[#DCB73C] rounded-t-3xl text-black font-bold text-lg">
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
