export const STORAGE_PASSKEY_LIST_KEY = 'safe_passkey_list'
export const PIMLICO_API_KEY = 'pim_TeYKjc6gDoVgnHL2bCF3WZ'
export const BASE_SEPOLIA_CHAIN_ID = '84532'
export const RPC_URL = 'https://sepolia.base.org'
export const BUNDLER_URL = `https://api.pimlico.io/v2/${BASE_SEPOLIA_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`
export const CHAIN_ID = BASE_SEPOLIA_CHAIN_ID
export const CHAIN_NAME = 'base-sepolia'

// Contract Addresses
export const PAYMASTER_ADDRESS = '0x0000000000000039cd5e8ae05257ce51c473ddd1'
export const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

// Gas limits for Safe deployment - using exact values from successful UserOp
export const CALL_GAS_LIMIT = BigInt('0x27867')          // 160,871
export const VERIFICATION_GAS_LIMIT = BigInt('0x3d3d94')  // 4,000,148
export const PRE_VERIFICATION_GAS = BigInt('0x2e8b5')     // 190,645

// Farm Factory Address
export const FARM_FACTORY_ADDRESS = "0xe37f47eCd434F04359a5830db4b3D617d209d083";

// USDC Contract Address
export const USDC_CONTRACT_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export const USDC_ABI = [
  // Add USDC contract ABI here
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
]