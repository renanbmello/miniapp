import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import MobileProposalDisplay from "@/components/Home/index";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center pt-4 pr-4 pl-4 gap-y-3">
      <MobileProposalDisplay userAddress={"0x7a45eE0be5C4BdC938A5F00A2AEF393f46502D26"} />
      {/* <SignIn />
      <VerifyBlock />
      <PayBlock /> */}
    </main>
  );
}


