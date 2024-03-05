import { BottomSheetView } from '@gorhom/bottom-sheet'
import { isPast, isToday } from 'date-fns'
import differenceInDays from 'date-fns/differenceInDays'
import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { HomeEvents } from 'src/analytics/Events'
import ValoraAnalytics from 'src/analytics/ValoraAnalytics'
import { openDeepLink } from 'src/app/actions'
import { BottomSheetRefType } from 'src/components/BottomSheet'
import BottomSheetBase from 'src/components/BottomSheetBase'
import Button, { BtnSizes, BtnTypes } from 'src/components/Button'
import { nftRewardDisplayed } from 'src/home/actions'
import { nftCelebrationSelector, showNftRewardSelector } from 'src/home/selectors'
import i18n from 'src/i18n'
import { nftsWithMetadataSelector } from 'src/nfts/selectors'
import Colors from 'src/styles/colors'
import { typeScale } from 'src/styles/fonts'
import { Spacing } from 'src/styles/styles'
import { formatDistanceToNow } from 'src/utils/time'

export default function NftRewardBottomSheet() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const canShowNftReward = useSelector(showNftRewardSelector)
  const nftCelebration = useSelector(nftCelebrationSelector)

  const nfts = useSelector(nftsWithMetadataSelector)
  const matchingNft = useMemo(
    () =>
      nfts.find(
        (nft) =>
          !!nftCelebration &&
          !!nftCelebration.networkId &&
          nftCelebration.networkId === nft.networkId &&
          !!nftCelebration.contractAddress &&
          nftCelebration.contractAddress === nft.contractAddress
      ),
    [nftCelebration]
  )

  const isVisible = canShowNftReward && matchingNft

  const insets = useSafeAreaInsets()
  const insetsStyle = { paddingBottom: Math.max(insets.bottom, Spacing.Regular16) }

  const bottomSheetRef = useRef<BottomSheetRefType>(null)

  const expirationDate = new Date(nftCelebration?.expirationDate ?? 0)
  const rewardReminderDate = new Date(nftCelebration?.rewardReminderDate ?? 0)

  const aboutToExpire = isToday(rewardReminderDate) || isPast(rewardReminderDate)
  const expirationLabelText = formatDistanceToNow(expirationDate, i18n, { addSuffix: true })

  const { pillStyle, labelStyle } = aboutToExpire
    ? {
        pillStyle: { backgroundColor: Colors.warningLight },
        labelStyle: { color: Colors.warningDark },
      }
    : {
        pillStyle: { backgroundColor: Colors.gray1 },
        labelStyle: { color: Colors.black },
      }

  useEffect(() => {
    if (isVisible) {
      // Wait for the home screen to have less ongoing async tasks.
      // This should help the bottom sheet animation run smoothly.
      const timeoutId = setTimeout(() => {
        bottomSheetRef.current?.expand()
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [isVisible])

  const handleBottomSheetPositionChange = (index: number) => {
    if (!nftCelebration) {
      return // This should never happen
    }

    if (index === -1) {
      ValoraAnalytics.track(HomeEvents.nft_reward_dismiss, {
        networkId: nftCelebration.networkId,
        contractAddress: nftCelebration.contractAddress,
        remainingDays: differenceInDays(expirationDate, Date.now()),
      })

      dispatch(nftRewardDisplayed())
    }
  }

  const handleCtaPress = () => {
    if (!nftCelebration) {
      return // This should never happen
    }

    ValoraAnalytics.track(HomeEvents.nft_reward_accept, {
      networkId: nftCelebration.networkId,
      contractAddress: nftCelebration.contractAddress,
      remainingDays: differenceInDays(expirationDate, Date.now()),
    })

    bottomSheetRef.current?.close()

    if (nftCelebration?.deepLink) {
      const isSecureOrigin = true
      dispatch(openDeepLink(nftCelebration.deepLink, isSecureOrigin))
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <BottomSheetBase forwardedRef={bottomSheetRef} onChange={handleBottomSheetPositionChange}>
      <BottomSheetView style={[styles.container, insetsStyle]}>
        <View style={[styles.pill, pillStyle]} testID="NftReward/Pill">
          <Text style={[styles.pillLabel, labelStyle]} testID="NftReward/PillLabel">
            {t('nftCelebration.rewardBottomSheet.expirationLabel', { expirationLabelText })}
          </Text>
        </View>
        <Text style={styles.title}>{t('nftCelebration.rewardBottomSheet.title')}</Text>
        <Text style={styles.description}>
          {t('nftCelebration.rewardBottomSheet.description', {
            nftName: matchingNft.metadata.name,
          })}
        </Text>
        <Button
          style={styles.button}
          type={BtnTypes.PRIMARY}
          size={BtnSizes.FULL}
          onPress={handleCtaPress}
          text={t('nftCelebration.rewardBottomSheet.cta')}
        />
      </BottomSheetView>
    </BottomSheetBase>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.Smallest8,
    marginHorizontal: Spacing.Thick24,
  },
  title: {
    ...typeScale.titleSmall,
  },
  description: {
    marginTop: Spacing.Regular16,
    ...typeScale.bodySmall,
    color: Colors.gray3,
  },
  button: {
    marginTop: Spacing.XLarge48,
  },
  pill: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.Regular16,
    ...typeScale.labelSemiBoldXSmall,
    paddingHorizontal: Spacing.Small12,
    paddingVertical: Spacing.Smallest8,
    borderRadius: 1000,
  },
  pillLabel: {
    ...typeScale.labelSemiBoldXSmall,
  },
})
