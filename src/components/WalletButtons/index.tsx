'use client'

import ConnectedWalletButton from './ConnectedWalletButton'
import { useWallet } from '../../providers/AppContext'
import { Button } from '../ui/Button';

const WalletButton = () => {
  const { address, connectWallet, isConnecting } = useWallet();
  
  return (
    !address ?
      <Button onClick={connectWallet} className="btn spray-dark w-44 py-2.5 text-lg" disabled={isConnecting}>Connect Wallet</Button>
    :
      <ConnectedWalletButton />
  )
}

export default WalletButton