import { ethers } from 'ethers'
import loadFarms from '../../lib/farmsUtils'
import { FARM_FACTORY_ADDRESS } from '../../lib/constants'

// Mock
jest.mock('ethers', () => {
  return {
    ethers: {
      JsonRpcProvider: jest.fn(() => ({
      })),
      Contract: jest.fn((address) => {
        if (address === FARM_FACTORY_ADDRESS) {
          return {
            getTotalFarms: jest.fn().mockResolvedValue(2),
            getFarm: jest.fn().mockResolvedValue([])
          }
        }
        return {
          pricePerToken: jest.fn().mockResolvedValue(100)
        }
      })
    }
  }
})

describe('loadFarms', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return empty array when no farms exist', async () => {
    // Override the mock for this specific test
    (ethers.Contract as jest.Mock).mockImplementation((address) => {
      if (address === FARM_FACTORY_ADDRESS) {
        return {
          getTotalFarms: jest.fn().mockResolvedValue(0),
          getFarm: jest.fn().mockResolvedValue([])
        }
      }
      return {
        pricePerToken: jest.fn().mockResolvedValue(100)
      }
    })

    const result = await loadFarms()
    expect(result).toEqual([])
  })

  it('should load farms with their token prices', async () => {
    (ethers.Contract as jest.Mock).mockImplementation((address) => {
      if (address === FARM_FACTORY_ADDRESS) {
        return {
          getTotalFarms: jest.fn().mockResolvedValue(2),
          getFarm: jest.fn().mockImplementation((index: number) => [
            `0xToken${index}`,
            `0xOwner${index}`,
            `Farm ${index}`,
            100 + index,
            1000 + index,
            50000 + index,
            15 + index,
            true,
            1234567890 + index
          ])
        }
      }
      return {
        pricePerToken: jest.fn().mockResolvedValue(100)
      }
    })

    const result = await loadFarms()

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      token: '0xToken0',
      owner: '0xOwner0',
      name: 'Farm 0',
      sizeInAcres: 100,
      totalTokenSupply: 1000,
      valuation: 50000,
      expectedOutcomePercentage: 15,
      isActive: true,
      timestamp: 1234567890,
      pricePerToken: 100
    })
  })

  it('should throw error when farm loading fails', async () => {
    (ethers.Contract as jest.Mock).mockImplementation((address) => {
      if (address === FARM_FACTORY_ADDRESS) {
        return {
          getTotalFarms: jest.fn().mockRejectedValue(new Error('Connection failed')),
          getFarm: jest.fn().mockResolvedValue([])
        }
      }
      return {
        pricePerToken: jest.fn().mockResolvedValue(100)
      }
    })

    await expect(loadFarms()).rejects.toThrow('Connection failed')
  })

  it('should throw error when getFarm fails', async () => {
    (ethers.Contract as jest.Mock).mockImplementation((address) => {
      if (address === FARM_FACTORY_ADDRESS) {
        return {
          getTotalFarms: jest.fn().mockResolvedValue(1),
          getFarm: jest.fn().mockRejectedValue(new Error('Failed to fetch farm'))
        }
      }
      return {
        pricePerToken: jest.fn().mockResolvedValue(100)
      }
    })

    await expect(loadFarms()).rejects.toThrow('Failed to fetch farm')
  })

  it('should throw error when pricePerToken fails', async () => {
    (ethers.Contract as jest.Mock).mockImplementation((address) => {
      if (address === FARM_FACTORY_ADDRESS) {
        return {
          getTotalFarms: jest.fn().mockResolvedValue(1),
          getFarm: jest.fn().mockResolvedValue([
            '0xToken0',
            '0xOwner0',
            'Farm 0',
            100,
            1000,
            50000,
            15,
            true,
            1234567890
          ])
        }
      }
      return {
        pricePerToken: jest.fn().mockRejectedValue(new Error('Failed to fetch price'))
      }
    })

    await expect(loadFarms()).rejects.toThrow('Failed to fetch price')
  })
    })
