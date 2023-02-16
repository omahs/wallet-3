import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { dappsFilterAndSearchEnabledSelector, favoriteDappsSelector } from 'src/dapps/selectors'
import { ActiveDapp, DappFilter, DappSection } from 'src/dapps/types'
import DappCard from 'src/dappsExplorer/DappCard'
import { NoResults } from 'src/dappsExplorer/NoResults'
import StarIllustration from 'src/icons/StarIllustration'
import Colors from 'src/styles/colors'
import fontStyles from 'src/styles/fonts'
import { Spacing } from 'src/styles/styles'

interface Props {
  onPressDapp: (dapp: ActiveDapp) => void
  filter?: DappFilter | null
  removeFilter?: () => void
}

export function FavoriteDappsSection({ onPressDapp, filter, removeFilter }: Props) {
  const { t } = useTranslation()
  const favoriteDapps = useSelector(favoriteDappsSelector)
  const dappsFilterAndSearchEnabled = useSelector(dappsFilterAndSearchEnabledSelector)

  // If no favorites, display no favorites section
  if (favoriteDapps.length === 0) {
    return (
      <View style={styles.container}>
        <StarIllustration />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('dappsScreen.noFavorites.title')}</Text>
          <Text style={styles.description}>{t('dappsScreen.noFavorites.description')}</Text>
        </View>
      </View>
    )
  }

  // If dapp filter enabled display favorites matching filter or no results section
  if (dappsFilterAndSearchEnabled) {
    // Favorites dapps matching category filter
    const favoritedDappsFiltered = favoriteDapps.filter(
      (dapp) =>
        dapp.categories && (dapp.categories.includes(filter?.id ?? '') || filter?.id === 'all')
    )
    // Matching favorite dapp(s) found
    if (favoriteDapps.length > 0 && favoritedDappsFiltered.length > 0) {
      return (
        <View testID="DAppsExplorerScreenV2/FavoriteDappsSection">
          {favoritedDappsFiltered.map((favoriteDapp) => (
            <DappCard
              key={favoriteDapp.id}
              dapp={favoriteDapp}
              section={DappSection.FavoritesDappScreen}
              onPressDapp={onPressDapp}
            />
          ))}
        </View>
      )
    } else {
      // No matching favorite dapp(s) found new return new no results section
      return (
        // @ts-expect-error filter and removeFilter are optional props, but will be defined if dappsFilterAndSearchEnabled is true
        <NoResults filter={filter} removeFilter={removeFilter} />
      )
    }
  }

  // If dappsFilterAndSearchEnabled is false (implied) and there are favorite dapp(s) then display old favorites section
  if (favoriteDapps.length > 0) {
    return (
      <View testID="DAppsExplorerScreen/FavoriteDappsSection">
        {favoriteDapps.map((favoriteDapp) => (
          <DappCard
            key={favoriteDapp.id}
            dapp={favoriteDapp}
            section={DappSection.FavoritesDappScreen}
            onPressDapp={onPressDapp}
          />
        ))}
      </View>
    )
  }

  // Catch all - don't return undefined for this component
  return (
    <View style={styles.container}>
      <StarIllustration />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('dappsScreen.noFavorites.title')}</Text>
        <Text style={styles.description}>{t('dappsScreen.noFavorites.description')}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginTop: Spacing.Thick24,
  },
  contentContainer: {
    marginLeft: Spacing.Regular16,
    flex: 1,
  },
  title: {
    ...fontStyles.regular600,
    marginBottom: 4,
  },
  description: {
    ...fontStyles.small,
    color: Colors.gray4,
  },
})

export default FavoriteDappsSection
