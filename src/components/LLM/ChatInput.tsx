import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({
  message,
  setMessage,
  onSend,
  isLoading,
}: {
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
  isLoading: boolean;
}) => (
  <div className="flex items-center p-4 gap-2 border-t border-white/10 bg-black/30">
    <textarea
      rows={1}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      disabled={isLoading}
      className="flex-1 resize-none bg-white/10 text-white p-3 rounded-2xl placeholder:text-white/50 border border-white/20 outline-none disabled:opacity-50"
      placeholder={isLoading ? "AI thinking..." : "Write a request..."}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSend();
        }
      }}
    />
    <button
      onClick={onSend}
      disabled={isLoading}
      className="p-3 rounded-full bg-[#DCB73C] text-black hover:scale-105 transition disabled:opacity-60"
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        <SendIcon />
      )}
    </button>
  </div>
);

export default ChatInput;
