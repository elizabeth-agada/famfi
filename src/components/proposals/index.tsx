'use client'

import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog"
import useContractWrite from "../../hooks/write-hooks/useContractWrite";
import type { FamilyType } from "../../types";
import { useState } from "react";
import ProposalCard from "./proposal-card";

const Proposals = ({ family }: { family: FamilyType }) => {
  const { createProposal } = useContractWrite();
  const familyId = Number(family?.familyId)
  const [openNewProposal, setOpenNewProposal] = useState<boolean>(false)
  const [proposalObj, setProposalObj] = useState({
    recipient: "",
    description: "",
    amount: "",
    title: "",
    duration: "",
  })

  const fillProposalForm = (e: any) => {
    if (e.target.id == 'amount') {
      if (Number(e.target.value) > -1 || e.target.value === '') {
        setProposalObj(prevState => ({ ...prevState, [e.target.id]: e.target.value }))
      }

      return
    }

    setProposalObj(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  
  return (
    <>
      <section className="mb-6">
        <Dialog open={openNewProposal} onOpenChange={setOpenNewProposal}>
          <DialogTrigger className="btn px-6 spray-dark text-sm">
            <i className="bi bi-plus-lg"></i> New Proposal
          </DialogTrigger>

          <DialogContent className="max-w-lg w-full bg-white border-0">
            <DialogHeader>
              <DialogTitle>Create Spending Proposal</DialogTitle>

              <DialogDescription>
                This action will create a spending proposal for your family members to consider
              </DialogDescription>
            </DialogHeader>

            <section className="gap-4 mt-6 pb-4 grid grid-cols-1 sm:grid-cols-6">
              <div className="space-y-1 sm:col-span-3">
                <label htmlFor="duration" className="block text-sm font-medium">Deadline of Proposal</label>
                <input id="duration" type="datetime-local" className="text-box" value={proposalObj.duration} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label htmlFor="amount" className="block text-sm font-medium">Proposed Spend Amount</label>
                <input id="amount" type="text" className="text-box" value={proposalObj.amount} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-6">
                <label htmlFor="recipient" className="block text-sm font-medium">Wallet Address To Receive Funds</label>
                <input id="recipient" type="text" className="text-box" value={proposalObj.recipient} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium">Title of Proposal</label>
                <input id="title" type="text" className="text-box" value={proposalObj.title} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium">Description of Proposal</label>
                <textarea id="description" className="text-box" rows={3} onChange={fillProposalForm}>{proposalObj.description}</textarea>
              </div>

              <Button className="btn w-full sm:w-1/2 chestnut h-14 sm:col-span-6" onClick={() => {
                createProposal(familyId, proposalObj.description, proposalObj.amount, proposalObj.recipient, proposalObj.title, proposalObj.duration).then(response => {
                  if (response) {
                    setProposalObj({
                      recipient: "",
                      description: "",
                      amount: "",
                      title: "",
                      duration: "",
                    })
                    setOpenNewProposal(false);
                  }
                })
              }}>Submit Proposal</Button>
            </section>

          </DialogContent>
        </Dialog>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {family?.proposals?.length > 0 ?
          family?.proposals?.map((proposal, index) => (
            <ProposalCard
              key={index}
              proposalIndex={index}
              proposal={proposal}
              familyId={familyId}
              familyMembers={family?.members}
            />
          ))
        :
          <div className="font-medium text-lg col-span-12">No proposals created in this family yet</div>
        }
      </section>
    </>
  )
}

export default Proposals