import { useNavigate } from "react-router-dom";
import content from "../assets/content.json"; 
import RecentMovies from "../components/RecentMovies";

const HeaderSection = () => (
  <div className="gap-16 flex flex-col items-center text-center px-4">
    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
      {content.header.title}
      <span className="block text-[#DCB73C] text-6xl md:text-8xl mt-2">
        {content.header.highlight}
      </span>
    </h1>
    <p className="text-white text-2xl md:text-4xl max-w-5xl">{content.header.description}</p>
  </div>
);

const OfferItem = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-6">
    <h3 className="text-[#DCB73C] text-3xl md:text-5xl mb-2 font-semibold">{title}</h3>
    <p className="text-white text-xl md:text-3xl">{description}</p>
  </div>
);

const OfferSection = () => (
  <div className="gap-16 flex flex-col items-center max-w-5xl w-full px-6 py-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg">
    <h2 className="text-5xl md:text-7xl font-bold text-white uppercase text-center">
      {content.offers.title}
    </h2>
    <div className="flex flex-col w-full text-left">
      {content.offers.items.map((item, index) => (
        <OfferItem key={index} title={item.title} description={item.description} />
      ))}
    </div>
  </div>
);

const JoinSection = ({ onJoin }: { onJoin: () => void }) => (
  <div className="gap-10 flex flex-col items-center px-4">
    <h2 className="text-5xl md:text-7xl font-bold text-white text-center uppercase">
      {content.join.title}
    </h2>
    <button
      onClick={onJoin}
      className="text-2xl cursor-pointer md:text-3xl px-12 py-6 rounded-full font-bold bg-[#DCB73C] text-black hover:scale-110 transition-all shadow-lg"
    >
      {content.join.button}
    </button>
  </div>
);

const RootPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative py-28 z-0 bg-[url(/home-bg.png)] bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-black/80 before:-z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-32 items-center relative z-10 px-4">
        <HeaderSection />
        <OfferSection />
        <RecentMovies/>
        <JoinSection onJoin={() => navigate("/login")} />
      </div>
    </div>
  );
};

export default RootPage;
