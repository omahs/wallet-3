import { render } from '@testing-library/react-native'
import React from 'react'
import { Provider } from 'react-redux'
import { NftCelebrationStatus } from 'src/home/reducers'
import { getFeatureGate } from 'src/statsig/index'
import { createMockStore } from 'test/utils'
import { mockNftAllFields } from 'test/values'
import NftCelebration from './NftCelebration'

jest.mock('src/analytics/ValoraAnalytics')
jest.mock('src/statsig')

const mockStoreWithoutNft = {
  nfts: {
    nfts: [],
    nftsLoading: false,
    nftsError: null,
  },
  home: { nftCelebration: null },
}

const mockStoreWithNft = {
  nfts: {
    nfts: [mockNftAllFields],
    nftsLoading: false,
    nftsError: null,
  },
  home: {
    nftCelebration: {
      networkId: mockNftAllFields.networkId,
      contractAddress: mockNftAllFields.contractAddress,
      status: NftCelebrationStatus.celebrationReadyToDisplay,
      expirationDate: '3000-12-01T00:00:00.000Z',
    },
  },
}

const mockStoreWithNftAndCelebrationDisplayed = {
  nfts: {
    nfts: [mockNftAllFields],
    nftsLoading: false,
    nftsError: null,
  },
  home: {
    nftCelebration: {
      networkId: mockNftAllFields.networkId,
      contractAddress: mockNftAllFields.contractAddress,
      status: NftCelebrationStatus.celebrationDisplayed,
    },
  },
}

const mockStoreWithDifferentNft = {
  nfts: {
    nfts: [{ ...mockNftAllFields, contractAddress: '0xNFT' }],
    nftsLoading: false,
    nftsError: null,
  },
  home: {
    nftCelebration: {
      networkId: mockNftAllFields.networkId,
      contractAddress: mockNftAllFields.contractAddress,
      status: NftCelebrationStatus.celebrationReadyToDisplay,
    },
  },
}

describe('NftCelebration', () => {
  beforeEach(() => {
    jest.mocked(getFeatureGate).mockReturnValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly when it should', () => {
    const { getByText } = render(
      <Provider store={createMockStore(mockStoreWithNft)}>
        <NftCelebration />
      </Provider>
    )

    expect(getByText('nftCelebration.bottomSheet.title')).toBeTruthy()
    expect(getByText('nftCelebration.bottomSheet.description')).toBeTruthy()
    expect(getByText('nftCelebration.bottomSheet.cta')).toBeTruthy()
  })

  it('does not render when user has no nfts', () => {
    const { queryByText } = render(
      <Provider store={createMockStore(mockStoreWithoutNft)}>
        <NftCelebration />
      </Provider>
    )

    expect(queryByText('nftCelebration.bottomSheet.title')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.description')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.cta')).toBeNull()
  })

  it('does not render when celebrated contract does not match with user nft', () => {
    const { queryByText } = render(
      <Provider store={createMockStore(mockStoreWithDifferentNft)}>
        <NftCelebration />
      </Provider>
    )

    expect(queryByText('nftCelebration.bottomSheet.title')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.description')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.cta')).toBeNull()
  })

  it('does not render when feature gate is closed', () => {
    jest.mocked(getFeatureGate).mockReturnValue(false)

    const { queryByText } = render(
      <Provider store={createMockStore(mockStoreWithNft)}>
        <NftCelebration />
      </Provider>
    )

    expect(queryByText('nftCelebration.bottomSheet.title')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.description')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.cta')).toBeNull()
  })

  it('does not render when user has alredy seen celebration for this contract', () => {
    const { queryByText } = render(
      <Provider store={createMockStore(mockStoreWithNftAndCelebrationDisplayed)}>
        <NftCelebration />
      </Provider>
    )

    expect(queryByText('nftCelebration.bottomSheet.title')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.description')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.cta')).toBeNull()
  })

  it('does not render if expired', () => {
    jest.useFakeTimers().setSystemTime(new Date('3001-01-01T00:00:00.000Z').getTime())

    const { queryByText } = render(
      <Provider store={createMockStore(mockStoreWithNft)}>
        <NftCelebration />
      </Provider>
    )

    expect(queryByText('nftCelebration.bottomSheet.title')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.description')).toBeNull()
    expect(queryByText('nftCelebration.bottomSheet.cta')).toBeNull()
  })
})
