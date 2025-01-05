import { ethers } from 'ethers'
import FarmFactory from '../../build/contracts/FarmFactory.json'
import FarmToken from '../../build/contracts/FarmToken.json'
import { RPC_URL, FARM_FACTORY_ADDRESS } from './constants'

const loadFarms = async () => {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const farmFactory = new ethers.Contract(
            FARM_FACTORY_ADDRESS,
            FarmFactory.abi,
            provider
        )

        // Get total number of farms
        const totalFarms = await farmFactory.getTotalFarms()
        const totalFarmsNumber = Number(totalFarms)

        if (totalFarmsNumber === 0) {
            return []
        }

        // Fetch all farms 
        const farmPromises = []
        for (let i = 0; i < totalFarmsNumber; i++) {
            farmPromises.push(farmFactory.getFarm(i))
        }

        const farms = await Promise.all(farmPromises)
        
        // Get token prices for each farm
        const tokenPricePromises = farms.map(farm => {
            const tokenContract = new ethers.Contract(
                farm[0], // token address
                FarmToken.abi,
                provider
            )
            return tokenContract.pricePerToken()
        })
        
        const tokenPrices = await Promise.all(tokenPricePromises)

        // Format the farm data to match the Farm type
        return farms.map((farm, index) => ({
            token: farm[0],             // address
            owner: farm[1],             // address
            name: farm[2],              // string
            sizeInAcres: Number(farm[3]),    // uint256
            totalTokenSupply: Number(farm[4]), // uint256
            valuation: Number(farm[5]),       // uint256
            expectedOutcomePercentage: Number(farm[6]), // uint256
            isActive: farm[7],          // bool
            timestamp: Number(farm[8]),   // uint256
            pricePerToken: Number(tokenPrices[index]) // Add the token price
        }))

    } catch (error) {
        console.error('Failed to load farms:', error)
        throw error
    }
}

export default loadFarms