"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteDisplay } from "./vote-display";
import { VoteProgress } from "./vote-progress";
import { TransactionVote } from "@/app/api/proposals/route";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

const MobileProposalDisplay = ({ userAddress }: { userAddress: string }) => {
  const [votedProposals, setVotedProposals] = useState<TransactionVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] =
    useState<TransactionVote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateRemainingTime = (timestamp: number): string => {
    const today = new Date();
    const endDate = new Date(timestamp * 1000);

    const difference = endDate.getTime() - today.getTime();

    const formatTime = (ms: number) => {
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

      if (days >= 2) {
        return `${days} days`;
      } else if (days == 1) {
        return `${days} day`;
      } else if (hours > 0) {
        return `${hours} hours`;
      } else if (minutes > 0) {
        return `${minutes} minutes`;
      } else {
        return "less than 1 minute";
      }
    };

    if (difference < 0) {
      return `Ended ${formatTime(Math.abs(difference))} ago`;
    }

    return `${formatTime(difference)} remaining`;
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          userAddress
            ? `/api/proposals?address=${userAddress}`
            : "/api/proposals"
        );
        const { data, success } = await response.json();

        if (success && data?.proposals) {
          setVotedProposals(data.proposals);
        } else {
          console.error("Data received is not an array:", data);
          setVotedProposals([]);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setVotedProposals([]);
        setError(
          error instanceof Error ? error.message : "Failed to fetch proposals"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [userAddress]);

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-500 p-4">
        Loading proposals...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-sm text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="absolute top-12 space-y-2 columns-xs pl-2 pr-2">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-semibold">Your Votes</h1>
        <span className="text-sm">
          Your Address: {formatAddress(userAddress)}
        </span>
      </div>
      {loading ? (
      <div className="text-center text-sm text-gray-500 p-4">
        Loading proposals...
      </div>
    ) : error ? (
      <div className="text-center text-sm text-red-500 p-4">{error}</div>
    ) : !Array.isArray(votedProposals) || votedProposals.length === 0 ? (
      <div className="text-center text-sm text-gray-500 p-4">
        No proposals found
      </div>
      ) : (
        votedProposals.map((votes) => (
          <Card
            key={votes.id}
            className="w-full hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setSelectedProposal(votes);
              setIsModalOpen(true);
            }}
          >
            <CardHeader className="p-3 flex-row">
              <CardTitle className="text-sm grow">
                {votes.proposal.title}
              </CardTitle>
              <VoteDisplay votingData={votes.proposal} />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xs text-gray-500">
                Created by: {formatAddress(votes.proposal.author)}
              </div>
              <div className="text-xs flex justify-between items-center w-full">
                <span className="text-gray-500">
                  Votes: {votes.proposal.votes}
                </span>
                <span className="text-gray-500">
                  {calculateRemainingTime(votes.proposal.end)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedProposal?.proposal.title}</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-2 flex-shrink-0">
            <div className=" flex justify-between items-center w-full">
              <p>
                <span className="font-semibold">Author:</span>{" "}
                {selectedProposal &&
                  formatAddress(selectedProposal.proposal.author)}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedProposal &&
                  calculateRemainingTime(selectedProposal.proposal.end)}
              </p>
            </div>
            {/* <p>Votes: {selectedProposal?.proposal.votes}</p> */}
            {selectedProposal ? (
              <VoteProgress votingData={selectedProposal!!.proposal} />
            ) : null}
          </div>
          <div className="mt-4 flex-1 overflow-y-auto overflow-x-hidden pr-2">
            <div className="text-sm">
              <ReactMarkdown className="markdown">
                {selectedProposal?.proposal.body || ""}
              </ReactMarkdown>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileProposalDisplay;
