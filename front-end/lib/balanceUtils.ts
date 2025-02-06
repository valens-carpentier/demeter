import { USDC_CONTRACT_ADDRESS } from './constants'

const SAFE_API_URL = 'https://safe-transaction-base-sepolia.safe.global/api'

export async function getUSDCBalance(safeAddress: string): Promise<string> {
    if (!safeAddress) throw new Error('Safe address is required')
    
    try {
        const url = `${SAFE_API_URL}/v1/safes/${safeAddress}/balances/`
        console.log('Fetching USDC balance from:', url)
        
        const response = await fetch(url)
        
        if (!response.ok) {
            console.error('Safe API error:', {
                status: response.status,
                statusText: response.statusText,
                url: url
            })
            throw new Error(`Safe API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Safe API balances response:', data)
        
        const usdcBalance = data.find((token: any) => 
            token.tokenAddress?.toLowerCase() === USDC_CONTRACT_ADDRESS.toLowerCase()
        )
        
        console.log('USDC balance found:', usdcBalance)
        
        if (!usdcBalance) {
            return '0.00'
        }

        // Ensure we're correctly parsing the balance
        const balance = parseFloat(usdcBalance.balance) / Math.pow(10, usdcBalance.decimals || 6)
        console.log('Parsed USDC balance:', balance)
        
        return balance.toFixed(2)
    } catch (error) {
        console.error('Failed to fetch USDC balance:', error)
        throw error
    }
}
