import type { Message } from "../../services/llm/chatService";
import ReactMarkdown from 'react-markdown';

const MessageList = ({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) => {
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {isEmpty && !isLoading && (
        <div className="text-center text-white/50 italic text-lg">
          No messages yet. Start the conversation!
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.from === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] p-4 text-lg rounded-xl transition-all ${
              msg.from === "user"
                ? "bg-[#DCB73C] text-black rounded-br-none"
                : "bg-white/10 text-white border border-white/10 rounded-bl-none"
            }`}
          >
            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="text-white text-sm italic opacity-70 text-center animate-pulse">
          AI is thinking...
        </div>
      )}
    </div>
  );
};

export default MessageList;
