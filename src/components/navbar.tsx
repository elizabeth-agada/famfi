'use client'
import WalletButton from './WalletButtons'

const NavBar = () => {
  return (
    <div className="bg-white py-3">
      <div className="container flex items-center justify-between">
        <aside className="font-bold text-xl sm:text-2xl">
          <a href="/">
            <img src="/img/famfi.png" width={150} height={3} alt='FamFi' />
          </a>
        </aside>

        <aside>
        </aside>

        <aside className="">
          <WalletButton />
        </aside>
      </div>
    </div>
  )
}

export default NavBar