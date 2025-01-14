const jumpstart = {
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'sentTo',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'contract IERC20',
          name: 'token',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'ERC20Claimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'contract IERC20',
          name: 'token',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'ERC20Deposited',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'sentTo',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'contract IERC721',
          name: 'token',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ERC721Claimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'contract IERC721',
          name: 'token',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ERC721Deposited',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
        {
          internalType: 'address',
          name: 'sendTo',
          type: 'address',
        },
      ],
      name: 'claimERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
        {
          internalType: 'address',
          name: 'sendTo',
          type: 'address',
        },
      ],
      name: 'claimERC721',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          internalType: 'contract IERC20',
          name: 'token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'depositERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          internalType: 'contract IERC721',
          name: 'token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'depositERC721',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'erc20Claims',
      outputs: [
        {
          internalType: 'contract IERC20',
          name: 'token',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'claimed',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'erc721Claims',
      outputs: [
        {
          internalType: 'contract IERC721',
          name: 'token',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'claimed',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const

export default jumpstart
