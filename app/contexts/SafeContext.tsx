import React from 'react'
import { PasskeyArgType } from '@safe-global/protocol-kit'

export const SafeAddressContext = React.createContext<string | undefined>(undefined)
export const PasskeyContext = React.createContext<PasskeyArgType | undefined>(undefined) 