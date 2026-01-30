"use client"

import { useState } from "react"
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog"
import { shortenAddress, copyToClipboard } from "../../lib/helper-functions";
import { toast } from "../ui/use-toast";
import type { FamilyMember } from "../../types";
import useContractWrite from "../../hooks/write-hooks/useContractWrite";


const MembersList = ({ member, familyId }: { member: FamilyMember, familyId: number }) => {
  const { removeFamilyMember } = useContractWrite();
  const [openRemoveMember, setOpenRemoveMember] = useState<boolean>(false)
  
  return (
    <tr className="text-sm font-medium">
      <td className="p-3 whitespace-nowrap">{member.name}</td>
      <td className="p-3 whitespace-nowrap">
        <span className="border-dotted border-b border-black cursor-copy" onClick={() => {
          copyToClipboard(member.addr).then(() => toast({ variant: "success", description: "Address successfully copied!" }))
        }}>{shortenAddress(member.addr)}</span>
      </td>
      <td className="p-3 whitespace-nowrap">{Number(member.isParent) === 1 ? 'Parent' : 'Child'}</td>

      <td className=" p-3">
        <Dialog open={openRemoveMember} onOpenChange={setOpenRemoveMember}>
          <DialogTrigger className="text-chestnut-600 text-lg">
            <i className="bi bi-trash3"></i>
          </DialogTrigger>

          <DialogContent className="max-w-md w-full bg-white border-0">
            <DialogHeader>
              <DialogTitle>Confirm Remove Family Member</DialogTitle>

              <DialogDescription>
                This action will remove the user from this family.
              </DialogDescription>
            </DialogHeader>

            <section className="space-y-8">
              <div className="block text-sm font-medium">
                You can close this prompt if you don&apos;t wish to continue or click the button below to remove the user.
              </div>

              <Button className="btn w-full sm:w-1/2 chestnut h-14" onClick={() => {
                removeFamilyMember(familyId, member.addr).then(response => {
                  if (response) {
                    setOpenRemoveMember(false);
                  }
                })
              }}>Yes, Remove Member</Button>
            </section>
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  )
}

export default MembersList