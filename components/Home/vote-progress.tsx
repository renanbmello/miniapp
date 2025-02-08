import { Proposal } from "@/lib/types"

export const VoteProgress = ({ votingData }: { votingData: Proposal }) => {
    const totalVotes = votingData.scores.reduce((acc, score) => acc + score, 0);
    
    return (
      <div className="w-full space-y-2">
        <div className="flex w-full h-4 rounded-full overflow-hidden bg-gray-100">
          {votingData.scores.map((score, index) => {
            const percentage = (score / totalVotes) * 100;
            
            // Cores diferentes para cada opção
            const colors = [
              "bg-green-500", // For
              "bg-red-500",   // Against
              "bg-gray-500"   // Abstain
            ];
  
            return (
              <div
                key={votingData.choices[index]}
                className={`${colors[index]} h-full`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>
  
        <div className="flex justify-between text-sm">
          {votingData.choices.map((choice, index) => {
            const percentage = ((votingData.scores[index] / totalVotes) * 100).toFixed(1);
            return (
              <div key={choice} className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full ${
                  choice === "For" ? "bg-green-500" : 
                  choice === "Against" ? "bg-red-500" : "bg-gray-500"
                }`} />
                <span>{choice}</span>
                <span className="text-gray-500">({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };