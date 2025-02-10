'use client'

import { useContext, useEffect, useState } from 'react'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'
import { getUserHoldings } from '../../../lib/holdingsUtils'
import { useRouter } from 'next/navigation'
import styles from '@/styles/pages/portfolio.module.css'
import SellModal from '../../../components/SellModal/SellModal'
import BuyFarmModal from '../../../components/BuyFarmModal/BuyFarmModal'
import { buyFarmTokensWithUSDC } from '../../../lib/tokenUtils'

interface UserHolding {
  farmName: string;
  tokenPrice: number;
  tokenBalance: number;
  userShare: number;
  tokenAddress: string;
  tokenSymbol: string;
  farmValuation: number;
}

export default function Portfolio() {
  const safeAddress = useContext(SafeAddressContext)
  const passkey = useContext(PasskeyContext)
  const router = useRouter()
  const [holdings, setHoldings] = useState<UserHolding[]>([])
  const [loading, setLoading] = useState(true)
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openBuyModal, setOpenBuyModal] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<UserHolding | null>(null)
  const [buyAmount, setBuyAmount] = useState('')
  const [isBuying, setIsBuying] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>('')

  useEffect(() => {
    if (passkey) {
      router.push(`/dashboard/portfolio?passkeyId=${passkey.rawId}`)
    }
  }, [passkey, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!safeAddress) return

      try {
        const userHoldings = await getUserHoldings(safeAddress)
        
        setHoldings(userHoldings)
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [safeAddress])

  const handleSellClick = (holding: UserHolding) => {
    setSelectedHolding(holding)
    setOpenSellModal(true)
  }

  const handleBuyClick = (holding: UserHolding) => {
    setSelectedHolding(holding)
    setOpenBuyModal(true)
  }

  const handleBuyConfirm = async () => {
    if (!selectedHolding || !safeAddress || !buyAmount || !passkey) return

    try {
      setIsBuying(true)
      const amount = parseInt(buyAmount)
      const hash = await buyFarmTokensWithUSDC(selectedHolding.tokenAddress, safeAddress, amount, passkey)
      setTransactionHash(hash)
    } catch (error: unknown) {
      console.error('Failed to buy tokens:', error)
      alert(error instanceof Error ? error.message : 'Failed to buy tokens. Please try again.')
      setOpenBuyModal(false)
    } finally {
      setIsBuying(false)
    }
  }

  return (
    <div className={styles.portfolioContainer}>
      <h1 className={styles.portfolioTitle}>
        Portfolio
      </h1>

      <h2 className={styles.title}>Wallets</h2>
      <div className={styles.walletCard}>
        <div className={styles.walletContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <span className={styles.walletAddress}>
                Loading address...
              </span>
            </div>
          ) : (
            <span className={styles.walletAddress}>
              Base Sepolia: {safeAddress}
            </span>
          )}
          <div className={styles.walletLinks}>
            <a 
              href={`https://app.safe.global/base-sepolia:${safeAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.walletLink}
            >
              Link to Safe Wallet
            </a>
            <div className={styles.divider} />
            <a 
              href={`https://sepolia.basescan.org/address/${safeAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.walletLink}
            >
              Link to Base Scan
            </a>
          </div>
        </div>
      </div>

      <h2 className={styles.title}>Your Holdings</h2>
      <div className={styles.assetsCard}>
        <div className={styles.assetsHeader}>
          <span className={styles.headerCell}>Farm Name</span>
          <span className={styles.headerCell}>Token Price</span>
          <span className={styles.headerCell}>Number of Tokens</span>
          <span className={styles.headerCell}>Your Holdings</span>
          <span className={styles.headerCell}></span>
        </div>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
          </div>
        ) : (
          holdings.length > 0 ? (
            holdings.map((holding, index) => (
              <div key={index} className={styles.assetRow}>
                <span className={styles.assetCell}>{holding.farmName}</span>
                <span className={styles.assetCell}>
                  ${holding.tokenPrice}
                </span>
                <span className={`${styles.assetCell} ${styles.tokenBalance}`}>
                  {holding.tokenBalance}
                </span>
                <span className={`${styles.assetCell} ${styles.holdingsValue}`}>
                  ${holding.userShare.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <div className={styles.buttonContainer}>
                  <button 
                    className={styles.sellButton}
                    onClick={() => handleSellClick(holding)}
                  >
                    Sell
                  </button>
                  <button 
                    className={styles.buyButton}
                    onClick={() => handleBuyClick(holding)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noAssetsMessage}>
              No assets found in your portfolio
            </p>
          )
        )}
      </div>

      <BuyFarmModal
        open={openBuyModal}
        onClose={() => {
          setOpenBuyModal(false)
          setTransactionHash('')
          setBuyAmount('')
        }}
        selectedFarm={{
          name: selectedHolding?.farmName || '',
          token: selectedHolding?.tokenAddress || '',
          pricePerToken: selectedHolding?.tokenPrice || 0
        }}
        buyAmount={buyAmount}
        onBuyAmountChange={(value) => setBuyAmount(value)}
        onBuyConfirm={handleBuyConfirm}
        isBuying={isBuying}
        transactionHash={transactionHash}
      />

      <SellModal
        open={openSellModal}
        onClose={() => setOpenSellModal(false)}
        holding={selectedHolding}
        safeAddress={safeAddress || ''}
        passkey={passkey!}
      />

    </div>
  )
}
