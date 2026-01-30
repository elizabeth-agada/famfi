'use client'

import NotConnectedWalletButton from "./components/WalletButtons";
import { useWallet } from "./providers/AppContext";


export default function App() {
  const { address } = useWallet();

  return (
    <main className="overflow-y-auto min-h-full">
      <section className="text-center min-h-screen flex flex-col items-center justify-center space-y-16">
        <div className="max-w-4xl space-y-4">
          <h1 className="text-6xl font-bold "> Secure <span className="text-spray-600">Family Funds</span> with
            <span className="text-spray-600"> Blockchain</span> Technology
          </h1>

          <p className="mb-8 text-base">
            Our platform offers decentralized, private, and immutable way to manage your family funds, ensuring transparency and representation in decision making.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="col-span-6 md:col-span-4 flex justify-end">
            {address ?
              <a href="/dashboard" className="btn spray px-6">Get Started</a>
            :
              <NotConnectedWalletButton />
            }
          </div>

          <button className="px-6 py-3 rounded-lg text-spray-500 font-medium hover:bg-spray-500 hover:text-white">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}
