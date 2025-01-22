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
            
            // Properly destructure the farm data from the Proxy object
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
            
            // Get token price
            const tokenContract = new ethers.Contract(
                farm.token,
                ['function pricePerToken() view returns (uint256)'],
                provider
            )
            const pricePerToken = await tokenContract.pricePerToken()

            farms.push({
                ...farm,
                pricePerToken: Number(pricePerToken) / 100
            })
        }

        return farms
    } catch (error) {
        console.error('Error loading farms:', error)
        throw error
    }
}

export default loadFarms