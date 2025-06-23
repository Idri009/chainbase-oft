// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {ChainbaseOFTAdapter} from "../contracts/ChainbaseOFTAdapter.sol";
import {SendParam} from "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import {MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// send C token base -> bsc
// forge script scripts/SendToken.s.sol:SendToken --rpc-url $RPC_URL --broadcast
contract SendToken is Script {
    using OptionsBuilder for bytes;

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function run() external {
        // Load environment variables
        address tokenAddress = vm.envAddress("TOKEN_ADDRESS");
        address oftAdapterAddress = vm.envAddress("OFT_ADAPTER_ADDRESS");
        address toAddress = vm.envAddress("TO_ADDRESS");
        uint256 tokensToSend = vm.envUint("TOKENS_TO_SEND");
        uint32 dstEid = uint32(vm.envUint("DST_EID"));
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(privateKey);

        ERC20(tokenAddress).approve(oftAdapterAddress, tokensToSend);

        ChainbaseOFTAdapter oftAdapter = ChainbaseOFTAdapter(oftAdapterAddress);

        // Build send parameters
        bytes memory extraOptions = OptionsBuilder.newOptions().addExecutorLzReceiveOption(65000, 0);
        SendParam memory sendParam = SendParam({
            dstEid: dstEid,
            to: addressToBytes32(toAddress),
            amountLD: tokensToSend,
            minAmountLD: tokensToSend * 95 / 100, // 5% slippage tolerance
            extraOptions: extraOptions,
            composeMsg: "",
            oftCmd: ""
        });

        // Get fee quote
        MessagingFee memory fee = oftAdapter.quoteSend(sendParam, false);

        console.log("Sending tokens...");
        console.log("Fee amount:", fee.nativeFee);

        // Send tokens
        oftAdapter.send{value: fee.nativeFee}(sendParam, fee, msg.sender);

        vm.stopBroadcast();
    }
}