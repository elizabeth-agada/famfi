import { useCallback } from "react";
import { STACKS_TESTNET } from "@stacks/network";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "../../lib/stacks-api";
import { fetchCallReadOnlyFunction, cvToJSON, Cl, } from '@stacks/transactions'
import { useWallet } from "../../providers/AppContext";
import { extractClarityValues } from "../../lib/helper-functions";


export default function useContractRead() {
  const { address } = useWallet();

  const getFamilies = useCallback(
    async (address: string) => {

      try {
        const result = await fetchCallReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "get-user-families",
          functionArgs: [Cl.principal(address)],
          network: STACKS_TESTNET,
          senderAddress: address,
        }).then(cvToJSON).then(res => res.value);

        const families = result?.map((b: any) => b.value).reverse();

        return families || [];
      } catch (getUserFamiliesError) {
        console.log(getUserFamiliesError);
      }
    }, [address]
  )

  const getFamilyDetails = useCallback(
    async (familyId: number) => {
      if (!address) return;

      try {
        const result = await fetchCallReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "get-family-details",
          functionArgs: [Cl.uint(familyId)],
          network: STACKS_TESTNET,
          senderAddress: address,
        }).then(cvToJSON).then(res => res.value);

        const extracted = extractClarityValues(result);

        return extracted
      } catch (getFamilyDetailsError) {
        console.log(getFamilyDetailsError);
      }
    }, [address]
  )
  
  const getUserFamilies = useCallback(
    async () => {
      if (!address) return [];

      const familyIds = await getFamilies(address);
      const families = await Promise.all(
        familyIds.map((familyId: number) => getFamilyDetails(familyId))
      );

      console.log("Fetched user families:", families);
      return families;
    }, [address, getFamilies, getFamilyDetails]
  )
  
  return {
    getUserFamilies,
  };
}