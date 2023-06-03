import { Move } from "@/types";
import Image from "next/image";

interface MoveSelectorProps {
  selectedMove: Move | null;
  onMoveSelect: (move: Move) => void;
}

const MoveSelector: React.FC<MoveSelectorProps> = ({
  selectedMove,
  onMoveSelect,
}) => {
  return (
    <div className="flex my-2 space-x-2">
      {Object.values(Move).map((move, index) => {
        if (isNaN(Number(move))) {
          return (
            <Image
              key={index}
              src={`/images/${String(move).toLowerCase()}.jpg`}
              title={move.toString()}
              alt={move.toString()}
              placeholder={"empty"}
              className={`w-20 h-20 cursor-pointer border rounded-md ${
                selectedMove === move
                  ? "border-violet-800 border-2"
                  : "border-transparent"
              }`}
              onClick={() => onMoveSelect(move as Move)}
              width={80}
              height={80}
            />
          );
        }
      })}
    </div>
  );
};

export default MoveSelector;
