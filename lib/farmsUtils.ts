import { ethers } from 'ethers'
import { FARM_FACTORY_ADDRESS, RPC_URL } from './constants'
import FarmFactoryJSON from './abis/FarmFactory.json'

const FarmFactoryABI = FarmFactoryJSON.abi 

async function loadFarms() {
    try {        
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const farmFactory = new ethers.Contract(
            FARM_FACTORY_ADDRESS,
            FarmFactoryABI,
            provider
        )

        const totalFarms = await farmFactory.getTotalFarms()
        
        const farms = []
        for (let i = 0; i < Number(totalFarms); i++) {
            const farmId = await farmFactory.allFarmIds(i)
            const farmData = await farmFactory.getFarm(farmId)
            
            
            const farm = {
                token: farmData[0],
                owner: farmData[1],
                name: farmData[2],
                sizeInAcres: Number(farmData[3]),
                totalTokenSupply: Number(farmData[4]),
                valuation: Number(farmData[5]),
                expectedOutcomePercentage: Number(farmData[6]),
                isActive: farmData[7],
                timestamp: Number(farmData[8])
            }
            
            const tokenContract = new ethers.Contract(
                farm.token,
                [
                    'function pricePerToken() view returns (uint256)',
                    'function balanceOf(address) view returns (uint256)',
                    'function decimals() view returns (uint8)'
                ],
                provider
            )

            const [pricePerToken, ownerBalance, decimals] = await Promise.all([
                tokenContract.pricePerToken(),
                tokenContract.balanceOf(FARM_FACTORY_ADDRESS),
                tokenContract.decimals()
            ])

            const availableTokens = Number(ethers.formatUnits(ownerBalance, decimals))

            farms.push({
                ...farm,
                pricePerToken: Number(pricePerToken) / 100,
                availableTokens
            })
        }

        return farms
    } catch (error) {
        console.error('Error loading farms:', error)
        throw error
    }
}

export default loadFarms