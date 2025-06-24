// import { EndpointId } from '@layerzerolabs/lz-definitions'
// import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
// import { TwoWayConfig, generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
// import { OAppEnforcedOption } from '@layerzerolabs/toolbox-hardhat'
//
// import type { OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
//
// const optimismContract: OmniPointHardhat = {
//     eid: EndpointId.OPTSEP_V2_TESTNET,
//     contractName: 'MyOFT',
// }
//
// const avalancheContract: OmniPointHardhat = {
//     eid: EndpointId.AVALANCHE_V2_TESTNET,
//     contractName: 'MyOFT',
// }
//
// const arbitrumContract: OmniPointHardhat = {
//     eid: EndpointId.ARBSEP_V2_TESTNET,
//     contractName: 'MyOFT',
// }
//
// // To connect all the above chains to each other, we need the following pathways:
// // Optimism <-> Avalanche
// // Optimism <-> Arbitrum
// // Avalanche <-> Arbitrum
//
// // For this example's simplicity, we will use the same enforced options values for sending to all chains
// // For production, you should ensure `gas` is set to the correct value through profiling the gas usage of calling OFT._lzReceive(...) on the destination chain
// // To learn more, read https://docs.layerzero.network/v2/concepts/applications/oapp-standard#execution-options-and-enforced-settings
// const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
//     {
//         msgType: 1,
//         optionType: ExecutorOptionType.LZ_RECEIVE,
//         gas: 80000,
//         value: 0,
//     },
// ]
//
// // With the config generator, pathways declared are automatically bidirectional
// // i.e. if you declare A,B there's no need to declare B,A
// const pathways: TwoWayConfig[] = [
//     [
//         optimismContract, // Chain A contract
//         avalancheContract, // Chain B contract
//         [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
//         [1, 1], // [A to B confirmations, B to A confirmations]
//         [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
//     ],
//     [
//         optimismContract, // Chain A contract
//         arbitrumContract, // Chain C contract
//         [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
//         [1, 1], // [A to B confirmations, B to A confirmations]
//         [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain C enforcedOptions, Chain A enforcedOptions
//     ],
//     [
//         avalancheContract, // Chain B contract
//         arbitrumContract, // Chain C contract
//         [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
//         [1, 1], // [A to B confirmations, B to A confirmations]
//         [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain C enforcedOptions, Chain B enforcedOptions
//     ],
// ]
//
// export default async function () {
//     // Generate the connections config based on the pathways
//     const connections = await generateConnectionsConfig(pathways)
//     return {
//         contracts: [{ contract: optimismContract }, { contract: avalancheContract }, { contract: arbitrumContract }],
//         connections,
//     }
// }
// import { EndpointId } from '@layerzerolabs/lz-definitions'
// import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
// import { TwoWayConfig, generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
// import { OAppEnforcedOption } from '@layerzerolabs/toolbox-hardhat'
//
// import type { OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
//
// const baseSepoliaContract: OmniPointHardhat = {
//     eid: EndpointId.BASESEP_V2_TESTNET,
//     contractName: 'ChainbaseOFTAdapter',
// }
//
// const bscTestnetContract: OmniPointHardhat = {
//     eid: EndpointId.BSC_V2_TESTNET,
//     contractName: 'ChainbaseOFT',
// }
//
// const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
//     {
//         msgType: 1,
//         optionType: ExecutorOptionType.LZ_RECEIVE,
//         gas: 80000,
//         value: 0,
//     },
// ]
//
// // 只需要一个双向路径：Base Sepolia <-> BSC Testnet
// const pathways: TwoWayConfig[] = [
//     [
//         baseSepoliaContract,
//         bscTestnetContract,
//         [['LayerZero Labs'], []], // 使用官方 DVN
//         [1, 1], // 两边都使用 1 个确认数
//         [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
//     ],
// ]
//
// export default async function () {
//     const connections = await generateConnectionsConfig(pathways)
//     return {
//         contracts: [{ contract: baseSepoliaContract }, { contract: bscTestnetContract }],
//         connections,
//     }
// }
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { TwoWayConfig, generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption } from '@layerzerolabs/toolbox-hardhat'

import type { OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const baseContract: OmniPointHardhat = {
    eid: EndpointId.BASE_V2_MAINNET,
    contractName: 'ChainbaseOFTAdapter',
}

const bscContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'ChainbaseOFT',
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
]

// 只需要一个双向路径：Base <-> BSC
const pathways: TwoWayConfig[] = [
    [
        baseContract,
        bscContract,
        [['LayerZero Labs'], []], // 使用官方 DVN
        [20, 20], // 两边都使用 20 个确认数
        [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
    ],
]

export default async function () {
    const connections = await generateConnectionsConfig(pathways)
    return {
        contracts: [{ contract: baseContract }, { contract: bscContract }],
        connections,
    }
}
