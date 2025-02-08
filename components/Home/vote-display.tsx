import { FaCheck, FaTimes, FaMinus, FaClock } from "react-icons/fa";
import { IconType } from "react-icons";

interface VotingData {
  choices: string[];
  scores: number[];
  state: "active" | "closed";
}

interface VoteResult {
  choice: string;
  score: number;
  icon: JSX.Element;
  colorClass: string;
}

function getHighestScoreChoice(data: VotingData): VoteResult {
  if (data.choices.length !== data.scores.length) {
    throw new Error("Os arrays choices e scores devem ter o mesmo tamanho");
  }

  const maxScoreIndex = data.scores.reduce(
    (maxIndex, currentScore, currentIndex, array) =>
      currentScore > array[maxIndex] ? currentIndex : maxIndex,
    0
  );

  const choice = data.choices[maxScoreIndex];
  const score = data.scores[maxScoreIndex];

  return {
    choice,
    score,
    ...getVoteStyle(choice),
  };
}

function getVoteStyle(choice: string): {
  icon: JSX.Element;
  colorClass: string;
} {
  const lowerChoice = choice.toLowerCase();

  if (lowerChoice.includes("for") || lowerChoice.includes("flook")) {
    return {
      icon: <FaCheck className="w-5 h-5" />,
      colorClass: "text-green-500",
    };
  } else if (lowerChoice.includes("against")) {
    return {
      icon: <FaTimes className="w-5 h-5" />,
      colorClass: "text-red-500",
    };
  } else {
    return {
      icon: <FaMinus className="w-5 h-5" />,
      colorClass: "text-gray-500",
    };
  }
}

export const VoteDisplay: React.FC<{ votingData: VotingData }> = ({
  votingData,
}) => {
  const result = getHighestScoreChoice(votingData);

  return (
    <div className="flex items-center gap-2">
      {votingData.state === "active" ? (
        <div className="flex items-center gap-2 mb-3">
          <FaClock className="w-5 h-5 text-blue-500 animate-pulse" />
        </div>
      ) : (
        <span className={result.colorClass}>{result.icon}</span>
      )}
    </div>
  );
};
