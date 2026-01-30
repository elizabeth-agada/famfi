"use client"

import { Button } from "../ui/Button";
import type { FamilyMember, FamilyProposals } from "../../types";
import { useState } from "react";
import useContractWrite from "../../hooks/write-hooks/useContractWrite";
import { toDecimal, formatNumberScale, getStatusColor } from "../../lib/helper-functions";
import { useWallet } from "../../providers/AppContext";

const ProposalCard = (
  { proposal, proposalIndex, familyMembers, familyId }:
  { proposal: FamilyProposals, proposalIndex: number, familyMembers: FamilyMember[], familyId: number }
) => {
  const { castVote, claimFunds, vetoProposal } = useContractWrite();
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const { address } = useWallet()

  return (
    <dl className="md:col-span-3 shadow-lg hover:shadow-lg duration-500 bg-white rounded-md flex flex-col">
      <div className="p-4 pb-1 flex items-center justify-between relative">
        <div className="font-semibold text-wrap">{proposal.title}</div>

        <div className="">
          <span className={`pill ${getStatusColor(proposal?.status)}`}>{proposal?.status}</span>
          <i className="bi bi-three-dots-vertical cursor-pointer" onClick={() => setOpenMenu(!openMenu)}></i>
        </div>

        <div className={`absolute right-4 bg-white border w-2/3 rounded shadow top-12 transition-all duration-150 z-10 ${openMenu ? 'scale-y-100 translate-y-0' : 'scale-y-0 -translate-y-1/2'}`}>
          {(proposal?.status === 'pending' && proposal?.proposer !== address) &&
            <div className="border-b p-4 space-y-3">
              <span className="font-bold text-xs text-gray-700">For Parents Only</span>

              <div className="flex items-center justify-between flex-wrap py-2">
                <Button className="btn py-2 px-3 spray"
                  onClick={() => vetoProposal(familyId, proposalIndex, 'approved').then(() => setOpenMenu(false))}
                >Approve</Button>

                <Button className="btn py-2 px-3 chestnut"
                  onClick={() => vetoProposal(familyId, proposalIndex, 'declined').then(() => setOpenMenu(false))}
                >Reject</Button>
              </div>
            </div>
          }

          {(proposal?.status !== 'rejected' && proposal?.status !== 'executed') &&
            <div className="p-4 space-y-3">
              <p className="font-bold text-xs text-gray-700">Proposal Initiator Only</p>

              <Button className="btn spray-dark w-full py-2.5"
                onClick={() => claimFunds(familyId, proposalIndex).then(() => setOpenMenu(false))}
              >Withdraw fund</Button>
            </div>
          }
        </div>
      </div>

      <div className="p-4 flex-1 text-sm"> {proposal.description} </div>

      <div className="flex items-center justify-between px-4">
        <div className="col-span-5 py-2 font-semibold">
          Amount: <span className="">{formatNumberScale(toDecimal(proposal.amount))} STX</span>
        </div>

        <div className="flex -space-x-1.5 overflow-hidden">
          {familyMembers?.slice(0, 4).map((member, index) => (
            <div key={index} className="flex items-center justify-center h-5 w-5 rounded-full ring-2 spray-dark ring-white font-semibold" title={member.name}>
              <i className="bi bi-person-fill"></i>
            </div>
          ))}

          {familyMembers?.length > 4 &&
            <div className="flex items-center justify-center h-5 w-5 rounded-full ring-2 spray-dark ring-white font-medium text-xs">+{familyMembers?.length - 4}</div>
          }
        </div>
      </div>

      <div className="flex items-center justify-between border-t p-4">
        <Button className="text-xl flex items-center text-green-600 gap-1 cursor-pointer" title="Vote Yes"
          onClick={() => castVote(familyId, proposalIndex, true, proposal?.hasVoted)}
        >
          <i className="bi bi-hand-thumbs-up-fill"></i>
          <span className="text-sm">Yes</span>
        </Button>

        <p className="text-sm">{proposal?.votesFor} / {proposal?.votesAgainst}</p>

        <Button className="text-xl flex items-center text-chestnut-600 gap-1 cursor-pointer" title="Vote No"
          onClick={() => castVote(familyId, proposalIndex, false, proposal?.hasVoted)}
        >
          <i className="bi bi-hand-thumbs-down-fill"></i>
          <span className="text-sm">No</span>
        </Button>
      </div>
    </dl>
  )
}

export default ProposalCard