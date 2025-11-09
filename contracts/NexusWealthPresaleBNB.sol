/**
 *Submitted for verification at BscScan.com on 2024-11-26
*/

// SPDX-License-Identifier: MIT
/*
 NexusWealth Investment Solution (BNB Deployment)
 
 SECURITY FEATURES:
 - ReentrancyGuard: All external functions that transfer funds are protected
   against reentrancy attacks using OpenZeppelin's ReentrancyGuard
 - Functions protected: buyToken(), buyTokenWithBnbPrice(), withdrawFunds()

 - Backend Price Verification: BNB prices are verified by authorized backend with signatures
 - Price Bounds Validation: BNB price limits ($150-$1,000) prevent extreme manipulation
 - Timestamp Validation: Price freshness requirements (5 minutes) prevent stale price attacks
 - Signature Replay Protection: Unique signature IDs prevent replay attacks
 - ERC20 Token Whitelist: Only approved BEP20 tokens can be used for payments
 
 DYNAMIC TIER-BASED PRICING SYSTEM:
 
 This contract implements a dynamic pricing system that automatically adjusts token prices
 based on the total amount of tokens sold. The system includes 6 price tiers:
 
 Tier 1: 0 - 1B tokens: $0.001 USD
 Tier 2: 1B - 3B tokens: $0.002 USD  
 Tier 3: 3B - 8B tokens: $0.003 USD
 Tier 4: 8B - 13B tokens: $0.004 USD
 Tier 5: 13B - 18B tokens: $0.006 USD
 Tier 6: 18B - 30B tokens: $0.008 USD
 
 
 BACKEND INTEGRATION WITH ALCHEMY/CHAINSTACK API (RECOMMENDED):
 
 This contract is designed to work with backend price fetching for maximum security. Here's the recommended approach:
 
 1. BACKEND fetches current BNB/USD price from Alchemy API, Chainstack, or CoinGecko API
 2. Backend validates price and optionally signs it for authenticity
 3. Frontend calls previewBnbPurchase() with backend-provided price
 4. User confirms purchase and frontend calls buyTokenWithBnbPrice()
*/

pragma solidity ^0.8.20;

// Import ReentrancyGuard for protection against reentrancy attacks
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/*
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// File @openzeppelin/contracts/access/Ownable.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

abstract contract Ownable is Context {
    address private immutable _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev Initializes the contract setting the deployer as the owner.
     */
    constructor(address initialOwner) {
        require(initialOwner != address(0), "Ownable: Invalid owner address");
        _owner = initialOwner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        if (_owner != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }
}

// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

// File @openzeppelin/contracts/utils/Address.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Address.sol)

pragma solidity ^0.8.20;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(
        address target,
        bytes memory data
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(
            data
        );
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(
        address target,
        bytes memory data
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(
        address target,
        bytes memory data
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata
    ) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}

// File @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using Address for address;

    /**
     * @dev An operation with an ERC20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(
        address spender,
        uint256 currentAllowance,
        uint256 requestedDecrease
    );

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(
            token,
            abi.encodeCall(token.transferFrom, (from, to, value))
        );
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 requestedDecrease
    ) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(
                    spender,
                    currentAllowance,
                    requestedDecrease
                );
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        bytes memory approvalCall = abi.encodeCall(
            token.approve,
            (spender, value)
        );

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(
                token,
                abi.encodeCall(token.approve, (spender, 0))
            );
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data);
        if (returndata.length != 0 && !abi.decode(returndata, (bool))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(
        IERC20 token,
        bytes memory data
    ) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return
            success &&
            (returndata.length == 0 || abi.decode(returndata, (bool))) &&
            address(token).code.length > 0;
    }
}

pragma solidity ^0.8.0;

interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);
}

// Original license: SPDX_License_Identifier: MIT

pragma solidity ^0.8.20;

contract NexusWealthPresaleBNB is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Metadata;

    // Tier-based pricing system
    struct PriceTier {
        uint256 startAmount;    // Starting amount for this tier (in tokens)
        uint256 endAmount;      // Ending amount for this tier (in tokens)
        uint256 price;          // Price in smallest units (e.g., 1000 = $0.001)
    }
    
    PriceTier[] public priceTiers;
    uint256 public currentTierIndex;

    address public saleToken;
    uint public saleTokenDec;

    uint256 public totalTokensforSale;

    mapping(address => bool) public payableTokens;

    bool public saleStatus;

    address[] public buyers;

    mapping(address => bool) public buyersExists;
    mapping(address => uint256) public buyersAmount;

    uint256 public totalBuyers;
    uint256 public totalTokensSold;

    address public ICO;
    address public DEV;

    
    // Backend verification system
    address public backendSigner;                              // Address authorized to sign prices
    bool public backendVerificationEnabled;                     // Whether signature verification is enabled
    uint256 public constant PRICE_TIMESTAMP_WINDOW = 300;      // 5 minutes for price freshness
    mapping(bytes32 => bool) public usedSignatures;            // Prevent signature replay attacks

    struct BuyerDetails {
        address buyer;
        uint amount;
    }

    event BuyToken(
        address indexed buyer,
        address indexed token,
        uint256 paidAmount,
        uint256 purchasedAmount
    );

    event BuyTokenWithBnb(
        address indexed buyer,
        uint256 bnbAmount,
        uint256 bnbUsdPrice,
        uint256 usdValue,
        uint256 purchasedAmount
    );
    
    event TierChanged(uint256 indexed oldTier, uint256 indexed newTier, uint256 totalTokensSold);
    event BackendSignerUpdated(address indexed newBackendSigner);
    event BackendVerificationToggled(bool enabled);
    event SaleConfigured(address indexed saleToken, uint256 totalTokens, bool saleStatus);
    event DebugUSDCalculation(uint256 amount, uint256 tokenDecimals, uint256 usdAmount);

    constructor(
        address _ICO,
        address _DEV
    ) Ownable(msg.sender) {
        saleStatus = false;
        ICO = _ICO;
        DEV = _DEV;
        
        // Initialize backend verification (disabled by default)
        backendVerificationEnabled = false;
        backendSigner = address(0);
        
        // Initialize price tiers
        initializePriceTiers();
    }
    
    /**
     * @dev Initialize the price tier system
 * Tier 1: 0 - 1B tokens: $0.001 USD
 * Tier 2: 1B - 3B tokens: $0.002 USD  
 * Tier 3: 3B - 8B tokens: $0.003 USD
 * Tier 4: 8B - 13B tokens: $0.004 USD
 * Tier 5: 13B - 18B tokens: $0.006 USD
 * Tier 6: 18B - 30B tokens: $0.008 USD
     */
    function initializePriceTiers() internal {
        // Convert billions to actual token amounts (assuming 18 decimals)
        uint256 billion = 1e9 * 1e18; // 1 billion tokens with 18 decimals
        
        priceTiers.push(PriceTier(0, 1 * billion, 1000));                 // 0 - 1B: $0.001
        priceTiers.push(PriceTier(1 * billion, 3 * billion, 2000));       // 1B - 3B: $0.002
        priceTiers.push(PriceTier(3 * billion, 8 * billion, 3000));      // 3B - 8B: $0.003
        priceTiers.push(PriceTier(8 * billion, 13 * billion, 4000));      // 8B - 13B: $0.004
        priceTiers.push(PriceTier(13 * billion, 18 * billion, 6000));     // 13B - 18B: $0.006
        priceTiers.push(PriceTier(18 * billion, 30 * billion, 8000));     // 18B - 30B: $0.008
        
        currentTierIndex = 0;
    }

    /**
     * @dev Validate that a purchase amount is within the allowed limits
     * @param usdAmount Purchase amount in USD (in smallest units - 6 decimals)
     * @return bool True if amount is within limits
     */
    //function validatePurchaseAmount(uint256 usdAmount) public pure returns (bool) {
    //    return usdAmount >= MIN_PURCHASE_USD && usdAmount <= MAX_PURCHASE_USD;
    //}

    /**
     * @dev Get current purchase limits in USD
     * @return minPurchase Minimum purchase amount in USD (6 decimals)
     * @return maxPurchase Maximum purchase amount in USD (6 decimals)
     */

    
    /**
     * @dev Set the backend signer address (owner only)
     * @param _backendSigner Address of the authorized backend signer
     */
    function setBackendSigner(address _backendSigner) external onlyOwner {
        require(_backendSigner != address(0), "NexusWealthIS: Invalid backend signer address");
        backendSigner = _backendSigner;
        emit BackendSignerUpdated(_backendSigner);
    }
    
    /**
     * @dev Enable or disable backend signature verification (owner only)
     * @param _enabled Whether to enable signature verification
     */
    function setBackendVerificationEnabled(bool _enabled) external onlyOwner {
        backendVerificationEnabled = _enabled;
        emit BackendVerificationToggled(_enabled);
    }
    
    /**
     * @dev Verify backend signature for price authenticity
     * @param _bnbUsdPrice BNB/USD price in smallest units
     * @param _backendTimestamp Timestamp when price was fetched
     * @param _backendSignature Backend signature
     * @return bool True if signature is valid
     */
    function verifyBackendSignature(
        uint256 _bnbUsdPrice,
        uint256 _backendTimestamp,
        bytes calldata _backendSignature
    ) internal returns (bool) {
        require(backendSigner != address(0), "NexusWealthIS: Backend signer not set");
        
        // Create message hash
        bytes32 messageHash = keccak256(abi.encodePacked(
            _bnbUsdPrice,
            _backendTimestamp,
            address(this),
            block.chainid
        ));
        
        // Create signature hash (BNB uses the same Ethereum signed message prefix)
        bytes32 bnbSignedMessageHash = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            messageHash
        ));
        
        // Recover signer
        address recoveredSigner = recoverSigner(bnbSignedMessageHash, _backendSignature);
        
        // Check if signer is authorized
        if (recoveredSigner != backendSigner) {
            return false;
        }
        
        // Check for signature replay
        bytes32 signatureId = keccak256(abi.encodePacked(
            _bnbUsdPrice,
            _backendTimestamp,
            backendSigner
        ));
        
        if (usedSignatures[signatureId]) {
            return false; // Signature already used
        }
        
        // Mark signature as used
        usedSignatures[signatureId] = true;
        
        return true;
    }
    
    /**
     * @dev Recover signer address from signature
     * @param _bnbSignedMessageHash Hash of the signed message
     * @param _signature Signature to recover from
     * @return address Recovered signer address
     */
    function recoverSigner(
        bytes32 _bnbSignedMessageHash,
        bytes calldata _signature
    ) internal pure returns (address) {
        require(_signature.length == 65, "NexusWealthIS: Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := calldataload(add(_signature.offset, 0))
            s := calldataload(add(_signature.offset, 32))
            v := byte(0, calldataload(add(_signature.offset, 64)))
        }
        
        // Handle signature malleability
        if (v < 27) v += 27;
        if (v != 27 && v != 28) revert("NexusWealthIS: Invalid signature 'v' value");
        
        return ecrecover(_bnbSignedMessageHash, v, r, s);
    }

    modifier saleEnabled() {
        require(saleStatus == true, "NexusWealthIS: is not enabled");
        _;
    }

    modifier saleStoped() {
        require(saleStatus == false, "NexusWealthIS: is not stopped");
        _;
    }

    function setSaleToken(
        address _saleToken,
        uint256 _totalTokensforSale,
        bool _saleStatus
    ) external onlyOwner {
        // Input validation
        require(_saleToken != address(0), "NexusWealthIS: Sale token cannot be zero address");
        require(_totalTokensforSale > 0, "NexusWealthIS: Total tokens for sale must be greater than 0");
        
        // Validate that the token contract exists and has the required interface
        require(_saleToken.code.length > 0, "NexusWealthIS: Sale token must be a contract");
        
        // Get token decimals safely
        try IERC20Metadata(_saleToken).decimals() returns (uint8 decimals) {
            require(decimals > 0 && decimals <= 18, "NexusWealthIS: Invalid token decimals");
            saleTokenDec = decimals;
        } catch {
            revert("NexusWealthIS: Failed to get token decimals");
        }
        
        // Validate total supply
        try IERC20(_saleToken).totalSupply() returns (uint256 totalSupply) {
            require(_totalTokensforSale <= totalSupply, "NexusWealthIS: Sale amount exceeds token total supply");
        } catch {
            revert("NexusWealthIS: Failed to get token total supply");
        }
        
        // Check if owner has sufficient balance
        require(
            IERC20(_saleToken).balanceOf(msg.sender) >= _totalTokensforSale,
            "NexusWealthIS: Insufficient token balance for sale"
        );
        
        // Check if owner has sufficient allowance
        require(
            IERC20(_saleToken).allowance(msg.sender, address(this)) >= _totalTokensforSale,
            "NexusWealthIS: Insufficient token allowance for sale"
        );
        
        // Set contract state
        saleToken = _saleToken;
        totalTokensforSale = _totalTokensforSale;
        saleStatus = _saleStatus;
        
        // Transfer tokens to contract
        IERC20(_saleToken).safeTransferFrom(
            msg.sender,
            address(this),
            _totalTokensforSale
        );
        
        // Emit configuration event
        emit SaleConfigured(_saleToken, _totalTokensforSale, _saleStatus);
    }

    function stopSale() external onlyOwner saleEnabled {
        saleStatus = false;
    }

    function resumeSale() external onlyOwner saleStoped {
        saleStatus = true;
    }
    
    /**
     * @dev Emergency pause function that can be called even during active sale
     * @param _pause Whether to pause or resume the sale
     */
    function emergencyPause(bool _pause) external onlyOwner {
        saleStatus = !_pause;
    }

    function addPayableTokens(
        address[] memory _tokens
    ) external onlyOwner {
        require(_tokens.length > 0, "NexusWealthIS: Token array cannot be empty");
        require(_tokens.length <= 50, "NexusWealthIS: Too many tokens to add at once");
        
        for (uint256 i = 0; i < _tokens.length; i++) {
            address token = _tokens[i];
            require(token != address(0), "NexusWealthIS: Token address cannot be zero");
            require(token.code.length > 0, "NexusWealthIS: Token must be a contract");
            require(!payableTokens[token], "NexusWealthIS: Token already whitelisted");
            
            // Validate that the token implements ERC20 interface
            try IERC20(token).totalSupply() returns (uint256) {
                payableTokens[token] = true;
            } catch {
                revert("NexusWealthIS: Token does not implement ERC20 interface");
            }
        }
    }

    function payableTokenStatus(
        address _token,
        bool _status
    ) external onlyOwner {
        require(_token != address(0), "NexusWealthIS: Token address cannot be zero");
        require(_token.code.length > 0, "NexusWealthIS: Token must be a contract");
        require(payableTokens[_token] != _status, "NexusWealthIS: Status already set to requested value");
        
        // Prevent removing the sale token from whitelist
        require(_token != saleToken || _status == true, "NexusWealthIS: Cannot remove sale token from whitelist");

        payableTokens[_token] = _status;
    }

    function getFixedPrice() external view returns (uint256) {
        return getCurrentTokenPrice();
    }

    function getFixedPriceInUSD() external view returns (uint256) {
        return getCurrentTokenPrice(); // Returns current tier price in smallest units
    }

    /**
     * @dev Preview BNB purchase without executing the transaction
     * @param _bnbAmount Amount of BNB to spend (in wei)
     * @param _bnbUsdPrice Current BNB/USD price in smallest units (6 decimals)
     * @return tokensToReceive Number of tokens that would be received
     * @return usdValue USD value of the BNB amount
     * @return currentTierPrice Current token price in USD (6 decimals)
     * @return tierIndex Current tier index
     * @return tierStart Starting amount for current tier
     * @return tierEnd Ending amount for current tier
     * 
     * Use this function to calculate expected token amount before making a purchase.
     * Backend should fetch current BNB price from Alchemy/Chainstack/CoinGecko API and pass it here.
     * 
     * Example: If BNB = $400 and buyer sends 1 BNB:
     * - _bnbAmount = 1000000000000000000 (1 BNB in wei)
     * - _bnbUsdPrice = 400000 ($400.00 in 6 decimals)
     * - Returns: tokens, $400 USD value, current tier price, tier info
     */
    function previewBnbPurchase(
        uint256 _bnbAmount,
        uint256 _bnbUsdPrice
    ) external view returns (
        uint256 tokensToReceive, 
        uint256 usdValue, 
        uint256 currentTierPrice,
        uint256 tierIndex,
        uint256 tierStart,
        uint256 tierEnd
    ) {
        require(_bnbAmount > 0, "NexusWealthIS: BNB amount must be greater than 0");
        require(_bnbUsdPrice > 0, "NexusWealthIS: BNB price must be greater than 0");
        
        // Validate BNB price is within reasonable bounds
        uint256 minBnbPrice = 150 * 1e6;   // $150.00 minimum
        uint256 maxBnbPrice = 1000 * 1e6;  // $1,000.00 maximum
        require(
            _bnbUsdPrice >= minBnbPrice && _bnbUsdPrice <= maxBnbPrice,
            "NexusWealthIS: BNB price outside reasonable bounds"
        );
        
        // Calculate USD value
        usdValue = (_bnbAmount * _bnbUsdPrice) / 1e18;
        require(usdValue > 0, "NexusWealthIS: USD value calculation failed");
        
        // Get current tier information
        currentTierPrice = getCurrentTokenPrice();
        require(currentTierPrice > 0, "NexusWealthIS: Invalid current token price");
        
        // Calculate tokens to receive
        require(currentTierPrice > 0, "NexusWealthIS: Current tier price cannot be zero");
        tokensToReceive = (usdValue * (10 ** saleTokenDec)) / currentTierPrice;
        
        // Get current tier details
        for (uint256 i = 0; i < priceTiers.length; i++) {
            if (totalTokensSold >= priceTiers[i].startAmount && totalTokensSold < priceTiers[i].endAmount) {
                tierIndex = i;
                tierStart = priceTiers[i].startAmount;
                tierEnd = priceTiers[i].endAmount;
                break;
            }
        }
        
        return (tokensToReceive, usdValue, currentTierPrice, tierIndex, tierStart, tierEnd);
    }
    


    /**
     * @dev Get the current token price based on total tokens sold
     * @return Current price in smallest units
     */
    function getCurrentTokenPrice() public view returns (uint256) {
        // Use cached tier index if available and valid
        if (currentTierIndex < priceTiers.length) {
            PriceTier memory currentTier = priceTiers[currentTierIndex];
            if (totalTokensSold >= currentTier.startAmount && totalTokensSold < currentTier.endAmount) {
                return currentTier.price;
            }
        }
        
        // Fallback to full search
        for (uint256 i = 0; i < priceTiers.length; i++) {
            if (totalTokensSold >= priceTiers[i].startAmount && totalTokensSold < priceTiers[i].endAmount) {
                return priceTiers[i].price;
            }
        }
        // If we're past all tiers, return the highest price
        return priceTiers[priceTiers.length - 1].price;
    }
    
    /**
     * @dev Get the current tier index based on total tokens sold
     * @return Current tier index
     */
    function getCurrentTierIndex() public view returns (uint256) {
        for (uint256 i = 0; i < priceTiers.length; i++) {
            if (totalTokensSold >= priceTiers[i].startAmount && totalTokensSold < priceTiers[i].endAmount) {
                return i;
            }
        }
        // If we're past all tiers, return the last tier index
        return priceTiers.length - 1;
    }
    
    /**
     * @dev Get the current token price in USD (for reference)
     * @return Current price in smallest units
     */
    function getTokenPriceUSD() external view returns (uint256) {
        return getCurrentTokenPrice();
    }
    
    /**
     * @dev Get information about all price tiers
     * @return Array of PriceTier structs
     */
    function getAllPriceTiers() external view returns (PriceTier[] memory) {
        return priceTiers;
    }
    
    /**
     * @dev Get current tier information
     * @return tierIndex Current tier index
     * @return startAmount Starting amount for current tier
     * @return endAmount Ending amount for current tier
     * @return price Current tier price
     */
    function getCurrentTierInfo() external view returns (
        uint256 tierIndex,
        uint256 startAmount,
        uint256 endAmount,
        uint256 price
    ) {
        for (uint256 i = 0; i < priceTiers.length; i++) {
            if (totalTokensSold >= priceTiers[i].startAmount && totalTokensSold < priceTiers[i].endAmount) {
                return (i, priceTiers[i].startAmount, priceTiers[i].endAmount, priceTiers[i].price);
            }
        }
        // If we're past all tiers, return the last tier
        uint256 lastIndex = priceTiers.length - 1;
        return (lastIndex, priceTiers[lastIndex].startAmount, priceTiers[lastIndex].endAmount, priceTiers[lastIndex].price);
    }
    
    /**
     * @dev Get next tier information (if available)
     * @return hasNextTier Whether there is a next tier available
     * @return tierIndex Next tier index
     * @return startAmount Starting amount for next tier
     * @return endAmount Ending amount for next tier
     * @return price Next tier price
     */
    function getNextTierInfo() external view returns (
        bool hasNextTier,
        uint256 tierIndex,
        uint256 startAmount,
        uint256 endAmount,
        uint256 price
    ) {
        for (uint256 i = 0; i < priceTiers.length; i++) {
            if (totalTokensSold >= priceTiers[i].startAmount && totalTokensSold < priceTiers[i].endAmount) {
                if (i + 1 < priceTiers.length) {
                    return (true, i + 1, priceTiers[i + 1].startAmount, priceTiers[i + 1].endAmount, priceTiers[i + 1].price);
                }
                return (false, 0, 0, 0, 0);
            }
        }
        return (false, 0, 0, 0, 0);
    }
    
    /**
     * @dev Calculate tokens remaining until next tier
     * @return tokensRemaining Number of tokens needed to reach next tier
     * @return nextTierPrice Price of the next tier
     */
    function getTokensUntilNextTier() external view returns (uint256 tokensRemaining, uint256 nextTierPrice) {
        for (uint256 i = 0; i < priceTiers.length; i++) {
            if (totalTokensSold >= priceTiers[i].startAmount && totalTokensSold < priceTiers[i].endAmount) {
                if (i + 1 < priceTiers.length) {
                    tokensRemaining = priceTiers[i].endAmount - totalTokensSold;
                    nextTierPrice = priceTiers[i + 1].price;
                    return (tokensRemaining, nextTierPrice);
                }
                return (0, 0); // Already at highest tier
            }
        }
        return (0, 0);
    }



    /**
     * @dev Calculate the amount of sale tokens to receive for a given BEP20 token amount
     * @param token Address of the BEP20 token being used for payment
     * @param amount Amount of BEP20 tokens being paid
     * @return Amount of sale tokens to receive
     */
    function getTokenAmount(
        address token,
        uint256 amount
    ) public view returns (uint256) {
        require(amount > 0, "NexusWealthIS: Amount must be greater than 0");
        require(saleTokenDec > 0, "NexusWealthIS: Sale token decimals not configured");
        require(token != address(0), "NexusWealthIS: Token address cannot be zero");
        require(payableTokens[token] == true, "NexusWealthIS: Token not whitelisted");
        
        uint256 currentPrice = getCurrentTokenPrice();
        require(currentPrice > 0, "NexusWealthIS: Current price cannot be zero");
        
        // Calculate tokens based on tier-based pricing
        uint256 amtOut = (amount * (10 ** saleTokenDec)) / currentPrice;
        return amtOut;
    }

    /**
     * @dev Calculate the amount of BEP20 tokens needed to purchase a given amount of sale tokens
     * @param token Address of the BEP20 token being used for payment
     * @param amount Amount of sale tokens to purchase
     * @return Amount of BEP20 tokens needed
     */
    function getPayAmount(
        address token,
        uint256 amount
    ) public view returns (uint256) {
        require(amount > 0, "NexusWealthIS: Amount must be greater than 0");
        require(saleTokenDec > 0, "NexusWealthIS: Sale token decimals not configured");
        require(token != address(0), "NexusWealthIS: Token address cannot be zero");
        require(payableTokens[token] == true, "NexusWealthIS: Token not whitelisted");
        
        uint256 currentPrice = getCurrentTokenPrice();
        require(currentPrice > 0, "NexusWealthIS: Current price cannot be zero");
        
        // Calculate payment amount based on tier-based pricing
        uint256 amtOut = (amount * currentPrice) / (10 ** saleTokenDec);
        return amtOut;
    }

    function transferBNB(uint256 _amount) internal {
        uint256 DEVAmt = (_amount * 5) / 100;
        (bool ok1, ) = payable(DEV).call{value: DEVAmt}("");
        require(ok1, "Dev payout failed");

        (bool ok2, ) = payable(ICO).call{value: _amount - DEVAmt}("");
        require(ok2, "ICO payout failed");
    }

    function transferToken(address _token, uint256 _amount) internal {
        uint256 DEVAmt = (_amount * 5) / 100;
        IERC20(_token).safeTransferFrom(
            msg.sender,
            DEV,
            DEVAmt
        );
        IERC20(_token).safeTransferFrom(
            msg.sender,
            ICO,
            _amount - DEVAmt
        );
    }

    /**
     * @dev Purchase tokens using whitelisted BEP20 tokens
     * @param _token Address of the whitelisted BEP20 token to pay with
     * @param _amount Amount of tokens to pay (in token's smallest units)
     * 
     * This function allows buyers to purchase tokens using whitelisted BEP20 tokens
     * (like USDC, USDT, etc.). The buyer must first approve the contract to spend
     * their tokens before calling this function.
     * 
     * SECURITY: This function includes comprehensive validation including:
     * - Token whitelist validation
     * - Balance and allowance checks
     * - Purchase amount limits
     * - Tier-based pricing
     */
    function buyToken(
        address _token,
        uint256 _amount
    ) external saleEnabled nonReentrant {
        // Input validation: Check for valid token address and amount
        require(_token != address(0), "NexusWealthIS: Token address cannot be zero");
        require(_amount > 0, "NexusWealthIS: Amount must be greater than 0");
        
        // Validate that sale token is set
        require(saleToken != address(0), "NexusWealthIS: Sale token not configured");
        require(saleTokenDec > 0, "NexusWealthIS: Sale token decimals not configured");
        
        // Validate total tokens for sale
        require(totalTokensforSale > 0, "NexusWealthIS: No tokens available for sale");
        
        // Validate token is whitelisted
        require(payableTokens[_token], "NexusWealthIS: Token not whitelisted");
        
        // Calculate tokens to receive based on tier-based pricing
        uint256 saleTokenAmt = getTokenAmount(_token, _amount);
        require(saleTokenAmt > 0, "NexusWealthIS: Calculated token amount is 0");
        
        // Validate against total supply
        require(
            totalTokensSold + saleTokenAmt <= totalTokensforSale,
            "NexusWealthIS: Not enough tokens available for sale"
        );
        
        
        // Get the actual decimals of the payment token
        uint256 tokenDecimals;
        try IERC20Metadata(_token).decimals() returns (uint8 decimals) {
            tokenDecimals = decimals;
        } catch {
            // Fallback to 18 decimals if we can't get the actual value
            tokenDecimals = 18;
        }
        
        
        // Check if buyer has sufficient balance and allowance
        require(
            IERC20(_token).balanceOf(msg.sender) >= _amount,
            "NexusWealthIS: Insufficient token balance"
        );
        require(
            IERC20(_token).allowance(msg.sender, address(this)) >= _amount,
            "NexusWealthIS: Insufficient token allowance"
        );
        
        // Check contract has sufficient sale tokens
        require(
            IERC20(saleToken).balanceOf(address(this)) >= saleTokenAmt,
            "NexusWealthIS: Contract has insufficient sale tokens"
        );
        
        // Transfer payment tokens from buyer to DEV and ICO addresses
        transferToken(_token, _amount);
        
        // Transfer sale tokens to buyer
        IERC20(saleToken).safeTransfer(msg.sender, saleTokenAmt);
        
        // Check for tier change before updating state
        uint256 oldTier = getCurrentTierIndex();
        
        // Update state variables
        totalTokensSold += saleTokenAmt;
        
        // Check if tier changed
        uint256 newTier = getCurrentTierIndex();
        if (oldTier != newTier) {
            currentTierIndex = newTier;
            emit TierChanged(oldTier, newTier, totalTokensSold);
        }
        
        if (!buyersExists[msg.sender]) {
            buyers.push(msg.sender);
            buyersExists[msg.sender] = true;
            totalBuyers += 1;
        }
        
        buyersAmount[msg.sender] += saleTokenAmt;
        
        emit BuyToken(msg.sender, _token, _amount, saleTokenAmt);
    }

    /**
     * @dev Purchase tokens using BNB with backend-verified USD price
     * @param _bnbUsdPrice Current BNB/USD price in smallest units (6 decimals)
     * @param _backendTimestamp Timestamp when price was fetched by backend
     * @param _backendSignature Backend signature to verify price authenticity
     * 
     * This function allows buyers to purchase tokens with BNB while providing the current
     * BNB/USD price verified by the backend. The BACKEND fetches this price from 
     * Alchemy/Chainstack/CoinGecko API and signs it to prevent manipulation.
     * 
     * Example: If BNB = $400 and buyer sends 1 BNB:
     * - USD Value = 1 BNB * $400 = $400
     * - Tokens = $400 / current tier price
     * 
     * SECURITY: This function includes comprehensive validation including:
     * - Price bounds validation
     * - Timestamp validation (price must be recent)
     * - Backend signature verification
     * - Front-running protection
     */
    function buyTokenWithBnbPrice(
        uint256 _bnbUsdPrice,
        uint256 _backendTimestamp,
        bytes calldata _backendSignature
    ) external payable saleEnabled nonReentrant {
        // Input validation: Check for valid BNB amount and price
        require(msg.value > 0, "NexusWealthIS: BNB amount must be greater than 0");
        require(_bnbUsdPrice > 0, "NexusWealthIS: BNB price must be greater than 0");
        require(_backendTimestamp > 0, "NexusWealthIS: Invalid backend timestamp");
        
        // Validate that sale token is set
        require(saleToken != address(0), "NexusWealthIS: Sale token not configured");
        require(saleTokenDec > 0, "NexusWealthIS: Sale token decimals not configured");
        
        // Validate total tokens for sale
        require(totalTokensforSale > 0, "NexusWealthIS: No tokens available for sale");
        
        // Validate BNB price is within reasonable bounds to prevent manipulation
        uint256 minBnbPrice = 150 * 1e6;   // $150.00 minimum
        uint256 maxBnbPrice = 1000 * 1e6;  // $1,000.00 maximum
        require(
            _bnbUsdPrice >= minBnbPrice && _bnbUsdPrice <= maxBnbPrice,
            "NexusWealthIS: BNB price outside reasonable bounds"
        );
        
        // Validate timestamp is recent (within last 5 minutes)
        require(
            block.timestamp - _backendTimestamp <= 300, // 5 minutes
            "NexusWealthIS: Price timestamp too old"
        );
        
        // Verify backend signature (if signature verification is enabled)
        if (backendVerificationEnabled) {
            require(
                verifyBackendSignature(_bnbUsdPrice, _backendTimestamp, _backendSignature),
                "NexusWealthIS: Invalid backend signature"
            );
        }
        
        // Calculate USD value of BNB sent
        uint256 usdAmount = (msg.value * _bnbUsdPrice) / 1e18;
        require(usdAmount > 0, "NexusWealthIS: USD amount calculation failed");
        
        
        // Calculate tokens based on USD amount and current tier-based pricing
        uint256 currentPrice = getCurrentTokenPrice();
        require(currentPrice > 0, "NexusWealthIS: Invalid current token price");
        
        uint256 saleTokenAmt = (usdAmount * (10 ** saleTokenDec)) / currentPrice;
        require(saleTokenAmt > 0, "NexusWealthIS: Calculated token amount is 0");
        
        // Validate against total supply
        require(
            totalTokensSold + saleTokenAmt <= totalTokensforSale,
            "NexusWealthIS: Not enough tokens available for sale"
        );
        
        // Check contract has sufficient sale tokens
        require(
            IERC20(saleToken).balanceOf(address(this)) >= saleTokenAmt,
            "NexusWealthIS: Contract has insufficient sale tokens"
        );
        
        // Transfer BNB to DEV and ICO addresses
        transferBNB(msg.value);
        
        // Transfer sale tokens to buyer
        IERC20(saleToken).safeTransfer(msg.sender, saleTokenAmt);
        
        // Check for tier change before updating state
        uint256 oldTier = getCurrentTierIndex();
        
        // Update state variables
        totalTokensSold += saleTokenAmt;
        
        // Check if tier changed
        uint256 newTier = getCurrentTierIndex();
        if (oldTier != newTier) {
            currentTierIndex = newTier;
            emit TierChanged(oldTier, newTier, totalTokensSold);
        }
        
        if (!buyersExists[msg.sender]) {
            buyers.push(msg.sender);
            buyersExists[msg.sender] = true;
            totalBuyers += 1;
        }
        
        buyersAmount[msg.sender] += saleTokenAmt;
        
        emit BuyTokenWithBnb(msg.sender, msg.value, _bnbUsdPrice, usdAmount, saleTokenAmt);
    }

    function buyersDetailsList(
        uint _from,
        uint _to
    ) external view returns (BuyerDetails[] memory) {
        require(_from < _to, "NexusWealthIS: _from should be less than _to");
        require(_from < totalBuyers, "NexusWealthIS: _from index out of bounds");
        
        // Limit the range to prevent gas limit issues
        require(_to - _from <= 100, "NexusWealthIS: Range too large, max 100 buyers per call");

        uint to = _to > totalBuyers ? totalBuyers : _to;
        uint from = _from > totalBuyers ? totalBuyers : _from;

        BuyerDetails[] memory buyersAmt = new BuyerDetails[](to - from);

        for (uint i = from; i < to; i += 1) {
            buyersAmt[i] = BuyerDetails(buyers[i], buyersAmount[buyers[i]]);
        }

        return buyersAmt;
    }

    function withdrawFunds(address token, uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "NexusWealthIS: Withdrawal amount must be greater than 0");
        
        if (token == address(0)) {
            // Withdraw BNB
            uint256 balance = address(this).balance;
            require(
                balance >= amount,
                "NexusWealthIS: Insufficient BNB balance"
            );
            
            // Prevent withdrawing all BNB if sale is active
            if (saleStatus) {
                require(
                    balance - amount >= 1 ether,
                    "NexusWealthIS: Must maintain minimum BNB balance during active sale"
                );
            }
            
            (bool success, ) = payable(owner()).call{value: amount}("");
            require(success, "NexusWealthIS: BNB transfer failed");
        } else {
            // Withdraw BEP20 tokens
            require(token.code.length > 0, "NexusWealthIS: Token must be a contract");
            
            uint256 balance = IERC20(token).balanceOf(address(this));
            require(
                balance >= amount,
                "NexusWealthIS: Insufficient token balance"
            );
            
            // Prevent withdrawing sale tokens if sale is active
            if (token == saleToken && saleStatus) {
                require(
                    balance - amount >= totalTokensforSale - totalTokensSold,
                    "NexusWealthIS: Must maintain sufficient sale tokens for active sale"
                );
            }
            
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
}

