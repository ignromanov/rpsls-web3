import GameSteps from "@/components/elements/GameSteps";
import StartGame from "@/components/pages/StartGame";

const IndexPage: React.FC = () => {
  return (
    <>
      <StartGame />
      <GameSteps />
    </>
  );
};

export default IndexPage;
