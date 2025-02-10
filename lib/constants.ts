export const STORAGE_PASSKEY_LIST_KEY = 'safe_passkey_list'
export const PIMLICO_API_KEY = 'pim_TeYKjc6gDoVgnHL2bCF3WZ'
export const PAYMASTER_URL = 'https://api.pimlico.io/v2/base-sepolia/rpc?apikey=pim_TeYKjc6gDoVgnHL2bCF3WZ'
export const BASE_SEPOLIA_CHAIN_ID = '84532'
export const RPC_URL = 'https://sepolia.base.org'
export const BUNDLER_URL = `https://api.pimlico.io/v2/${BASE_SEPOLIA_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`
export const CHAIN_ID = BASE_SEPOLIA_CHAIN_ID
export const CHAIN_NAME = 'base-sepolia'

// Contract Addresses
export const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

// Farm Factory Address
export const FARM_FACTORY_ADDRESS = "0x489C7835862c55B4A00efE4C68B695d66009D6f7";

// USDC Contract Address
export const USDC_CONTRACT_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export const USDC_ABI = [
  // Add USDC contract ABI here
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
]