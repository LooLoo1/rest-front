import ChatIcon from "@mui/icons-material/Chat";

const FloatingButton = ({ onClick }: { onClick: (event: React.MouseEvent) => void }) => (
  <button
    onClick={ onClick}
    className="fixed bottom-6 right-6 w-16 h-16 bg-[#DCB73C] text-black rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center z-50"
  >
    <ChatIcon fontSize="large" />
  </button>
);

export default FloatingButton;
