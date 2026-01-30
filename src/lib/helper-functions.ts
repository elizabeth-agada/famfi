// Helper functions for various formatting and utility tasks

import { ProposalStatus } from "../types";

export const truncateValue = (valueToTruncate: any, decimals = 3) => {
  const truncated = Math.trunc(valueToTruncate * Math.pow(10, decimals)) / Math.pow(10, decimals);

  return truncated;
};

export const toDecimal = (SCValue: any) => {
  return SCValue / Math.pow(10, 6);
};

export function shortenAddress(address: string, chars = 4): string {
  try {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
}

export function formatNumberScale(number: any, usd = false) {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : '0'
  }
  const num = parseFloat(number)
  const wholeNumberLength = String(Math.floor(num)).length

  if (wholeNumberLength >= 13) return (usd ? '$' : '') + (num / Math.pow(10, 12)).toFixed(1) + 'T'
  if (wholeNumberLength >= 10) return (usd ? '$' : '') + (num / Math.pow(10, 9)).toFixed(1) + 'B'
  if (wholeNumberLength >= 7) return (usd ? '$' : '') + (num / Math.pow(10, 6)).toFixed(1) + 'M'
  if (wholeNumberLength >= 4) return (usd ? '$' : '') + (num / Math.pow(10, 3)).toFixed(1) + 'K'

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  return (usd ? '$' : '') + truncateValue(num, 2)
}

export const copyToClipboard = async (textToCopy: any) => {
  navigator.clipboard.writeText(textToCopy);
  return true;
};

// Helper function to convert kebab-case to camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Helper function to recursively extract values from Clarity JSON response
export const extractClarityValues = (data: any): any => {
  if (data === null || data === undefined) return data;
  
  // If it has a "value" property, it's a Clarity type wrapper
  if (typeof data === 'object' && 'value' in data) {
    return extractClarityValues(data.value);
  }
  
  // If it's an array, extract values from each item
  if (Array.isArray(data)) {
    return data.map(extractClarityValues);
  }
  
  // If it's an object, extract values from each property and convert keys to camelCase
  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [toCamelCase(key), extractClarityValues(val)])
    );
  }
  
  // Primitive value, return as-is
  return data;
};

export const getStatusColor = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.Pending:
      return 'bg-amber-100 text-amber-700';
      case ProposalStatus.Approved:
      return 'bg-green-100 text-green-800';
    case ProposalStatus.Rejected:
      return 'bg-blue-100 text-blue-800';
    case ProposalStatus.Executed:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};