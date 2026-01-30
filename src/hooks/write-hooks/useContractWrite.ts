import { useCallback } from "react";
import { toast } from "../../components/ui/use-toast";
import { STACKS_TESTNET } from "@stacks/network";
import { CONTRACT_ADDRESS, CONTRACT_NAME, EXPLORER_URL } from "../../lib/stacks-api";
import { openContractCall } from "@stacks/connect";
import { PostConditionMode, Cl, validateStacksAddress } from '@stacks/transactions'
import { useWallet } from "../../providers/AppContext";

export default function useContractWrite() {
  const { address, setIsLoading } = useWallet();
  
  const createFamilyAccount = useCallback(
    async(familyName: string, personName: string) => {
      setIsLoading(true);

      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        setIsLoading(false)
        return false
      }

      if (!familyName) {
        toast({ variant: "error", description: "Family name is required!" })
        setIsLoading(false)
        return false
      }

      if (!personName) {
        toast({ variant: "error", description: "Your name is required!" })
        setIsLoading(false)
        return false
      }

      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "create-family",
          functionArgs: [
            Cl.stringAscii(familyName),
            Cl.stringAscii(personName)
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            toast({
              variant: "success",
              description: `Family account creation successful!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        return false;
      } finally {
        setIsLoading(false)
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )

  const createProposal = useCallback(
    async (familyId: number, description: string, amount: string, recipient: string, title: string, duration: string) => {
      setIsLoading(true)

      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        setIsLoading(false)
        return false
      }

      if (!validateStacksAddress(recipient)) {
        toast({ variant: "error", description: "Wallet address to receive funds is not valid" })
        setIsLoading(false)
        return false
      }

      if (!description) {
        toast({ variant: "error", description: "Proposal description is required" })
        setIsLoading(false)
        return false
      }

      if (!amount) {
        toast({ variant: "error", description: "Proposal amount is required" })
        setIsLoading(false)
        return false
      }

      const proposedAmount = Math.floor(parseFloat(amount) * 1_000_000)

      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "create-proposal",
          functionArgs: [
            Cl.uint(familyId),
            Cl.stringAscii(title),
            Cl.stringAscii(description),
            Cl.uint(proposedAmount),
            Cl.principal(recipient),
            Cl.uint(Math.floor(new Date(duration).getTime() / 1000))
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            toast({
              variant: "success",
              description: `Spend proposal created successfully!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        return false;
      } finally {
        setIsLoading(false)
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )

  const addFamilyMember = useCallback(
    async (familyId: number, memberAddress: string, memberName: string, personIsParent: boolean) => {
      setIsLoading(true)

      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        setIsLoading(false)
        return false
      }

      if (!validateStacksAddress(memberAddress)) {
        toast({ variant: "error", description: "Family member wallet address is not valid" })
        setIsLoading(false)
        return false
      }

      if (!memberName) {
        toast({ variant: "error", description: "Family member name is required" })
        setIsLoading(false)
        return false
      }
      
      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "add-member",
          functionArgs: [
            Cl.uint(familyId),
            Cl.stringAscii(memberName),
            Cl.principal(memberAddress),
            Cl.bool(personIsParent)
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            toast({
              variant: "success",
              description: `Family member added successfully!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        console.log("Error adding family member:", error);
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        setIsLoading(false)
        return false;
      } finally {
        setIsLoading(false)
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )

  const removeFamilyMember = useCallback(
    async (familyId: number, memberAddress: string) => {
      setIsLoading(true)

      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        setIsLoading(false)
        return false
      }
      
      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "remove-member",
          functionArgs: [
            Cl.uint(familyId),
            Cl.principal(memberAddress)
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            toast({
              variant: "success",
              description: `Remove family member transaction submitted!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        setIsLoading(false)
        return false;
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )

  const castVote = useCallback(
    async (familyId: number, proposalId: number, inFavor: boolean, hasVoted: boolean) => {
      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        return false
      }

      if (hasVoted) {
        toast({ variant: "error", description: "You have already voted on this proposal!" })
        return false
      }

      setIsLoading(true)
      
      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "vote",
          functionArgs: [
            Cl.uint(familyId),
            Cl.uint(proposalId),
            Cl.bool(inFavor)
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            console.log(data)
            toast({
              variant: "success",
              description: `You've voted successfully!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        return false;
      } finally {
        setIsLoading(false)
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )

  const claimFunds = useCallback(
    async (familyId: number, proposalId: number) => {
      setIsLoading(true)

      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        setIsLoading(false)
        return false
      }
      
      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "claim-funds",
          functionArgs: [
            Cl.uint(familyId),
            Cl.uint(proposalId)
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            toast({
              variant: "success",
              description: `Funds successfully claimed!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        return false;
      } finally {
        setIsLoading(false)
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )

  const vetoProposal = useCallback(
    async (familyId: number, proposalId: number, approvalStatus: string) => {
      setIsLoading(true)

      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        setIsLoading(false)
        return false
      }
      
      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "veto-proposal",
          functionArgs: [
            Cl.uint(familyId),
            Cl.uint(proposalId),
            Cl.stringAscii(approvalStatus)
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            toast({
              variant: "success",
              description: `Proposal vetoed successfully!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        return false;
      } finally {
        setIsLoading(false)
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )

  const depositFundsToFamilyWallet = useCallback(
    async (familyId: number, amount: string) => {
      if (!address) {
        toast({ variant: "error", description: "No connected wallet!" })
        setIsLoading(false)
        return false
      }

      setIsLoading(true)
      
      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "deposit-funds",
          functionArgs: [
            Cl.uint(familyId),
            Cl.uint(Math.floor(parseFloat(amount) * 1_000_000))
          ],
          postConditionMode: PostConditionMode.Allow,
          network: STACKS_TESTNET,
          onFinish: (data) => {
            toast({
              variant: "success",
              description: `Funds deposited successfully!`,
              action: { url: `${EXPLORER_URL}/txid/${data.txId}??chain=testnet`, label: "View in explorer" }
            })
            return true;
          },
        });
      } catch (error: {} | any) {
        toast({ variant: "error", description: (error instanceof Error ? error.message : String(error)) })
        return false;
      } finally {
        setIsLoading(false)
      }
    }, [address, EXPLORER_URL, setIsLoading]
  )
  
  return {
    createFamilyAccount,
    createProposal,
    addFamilyMember,
    removeFamilyMember,
    castVote,
    claimFunds,
    vetoProposal,
    depositFundsToFamilyWallet
  };
}