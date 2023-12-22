import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { Circle, G, Line, Text as SvgText } from 'react-native-svg'
import { useDispatch } from 'react-redux'
import i18n from 'src/i18n'
import { LocalCurrencyCode } from 'src/localCurrency/consts'
import { convertDollarsToLocalAmount } from 'src/localCurrency/convert'
import { getLocalCurrencyCode, usdToLocalCurrencyRateSelector } from 'src/localCurrency/selectors'
import { RootState } from 'src/redux/reducers'
import useSelector from 'src/redux/useSelector'
import colors from 'src/styles/colors'
import { Spacing } from 'src/styles/styles'
import variables from 'src/styles/variables'
import { tokenPriceHistorySelector, tokenPriceHistoryStatusSelector } from 'src/tokens/selectors'
import { fetchPriceHistoryStart } from 'src/tokens/slice'
import { getLocalCurrencyDisplayValue } from 'src/utils/formatting'
import { ONE_DAY_IN_MILLIS, ONE_HOUR_IN_MILLIS, formatFeedDate } from 'src/utils/time'
import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory-native'

const CHART_WIDTH = variables.width
const CHART_HEIGHT = 180
const CHART_MIN_VERTICAL_RANGE = 0.01 // one cent
const CHART_DOMAIN_PADDING = { y: [30, 30] as [number, number], x: [5, 5] as [number, number] }
const CHART_STEP_IN_HOURS = 6

function Loader({ color = colors.goldBrand }: { color?: colors }) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={color} />
    </View>
  )
}

function ChartAwareSvgText({
  position,
  x,
  y,
  value,
  chartWidth,
}: {
  position: 'top' | 'bottom'
  x: number
  y: number
  value: string
  chartWidth: number
}) {
  if (position === 'top') {
    y = y - 16
  } else if (position === 'bottom') {
    y = y + 25
  }
  const [adjustedX, setAdjustedX] = useState(x)
  const horizontalOffset = variables.contentPadding
  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width },
      },
    }: LayoutChangeEvent) => {
      if (Math.abs(width - chartWidth) > 2) {
        if (x - width / 2 - horizontalOffset < 0) {
          setAdjustedX(width / 2 + horizontalOffset)
        }
        if (x + width / 2 + horizontalOffset > chartWidth) {
          setAdjustedX(chartWidth - width / 2 - horizontalOffset)
        }
      }
    },
    [x]
  )
  return (
    <SvgText
      /*
      // @ts-ignore */
      onLayout={onLayout}
      fill={colors.gray4}
      fontSize="14"
      fontFamily="Inter-Regular"
      x={adjustedX}
      y={y}
      textAnchor="middle"
    >
      {value}
    </SvgText>
  )
}

function renderPointOnChart(
  chartData: Array<{ amount: number | BigNumber; displayValue: string }>,
  chartWidth: number,
  color: colors
) {
  let lowestRateIdx = 0,
    highestRateIdx = 0
  chartData.forEach((rate, idx) => {
    if (rate.amount > chartData[highestRateIdx].amount) {
      highestRateIdx = idx
    }
    if (rate.amount < chartData[lowestRateIdx].amount) {
      lowestRateIdx = idx
    }
  })
  return ({ datum, x, y }: { x: number; y: number; datum: { _x: number; _y: number } }) => {
    const idx = datum._x
    const result = []
    switch (idx) {
      case 0:
        result.push(
          <G key={idx + 'dot'}>
            <Line x1={0} y1={y} x2={chartWidth} y2={y} stroke={colors.gray2} strokeWidth="1" />
            <Circle cx={x} cy={y} r="4" fill={color} />
          </G>
        )
        break

      case chartData.length - 1:
        result.push(
          <G key={idx + 'dot'}>
            <Circle cx={x} cy={y} r="4" fill={color} />
          </G>
        )
        break
    }
    switch (idx) {
      case highestRateIdx:
        result.push(
          <ChartAwareSvgText
            x={x}
            y={y}
            key={idx}
            value={chartData[highestRateIdx].displayValue}
            position={'top'}
            chartWidth={chartWidth}
          />
        )
        break

      case lowestRateIdx:
        result.push(
          <ChartAwareSvgText
            x={x}
            y={y}
            key={idx}
            value={chartData[lowestRateIdx].displayValue}
            position={'bottom'}
            chartWidth={chartWidth}
          />
        )
        break
    }

    switch (result.length) {
      case 0:
        return null
      case 1:
        return result[0]
      default:
        return <>{result}</>
    }
  }
}

interface TokenPriceChartProps {
  tokenId: string
  containerStyle?: ViewStyle
  testID?: string
  chartPadding?: number
  color?: colors
}

export default function TokenPriceChart({
  tokenId,
  containerStyle,
  testID,
  chartPadding,
  color = colors.black,
}: TokenPriceChartProps) {
  const tokenPriceHistory = useSelector((state: RootState) =>
    tokenPriceHistorySelector(state, tokenId)
  )
  const tokenPriceHistoryStatus = useSelector((state: RootState) =>
    tokenPriceHistoryStatusSelector(state, tokenId)
  )
  const localCurrencyCode = useSelector(getLocalCurrencyCode)
  const localExchangeRate = useSelector(usdToLocalCurrencyRateSelector)
  const dispatch = useDispatch()

  const dollarsToLocal = useCallback(
    (amount: BigNumber.Value | null) =>
      convertDollarsToLocalAmount(amount, localCurrencyCode ? localExchangeRate : 1),
    [localExchangeRate]
  )
  const displayLocalCurrency = useCallback(
    (amount: BigNumber.Value) =>
      getLocalCurrencyDisplayValue(amount, localCurrencyCode || LocalCurrencyCode.USD, true),
    [localCurrencyCode]
  )

  useEffect(() => {
    if (
      tokenPriceHistory.length &&
      tokenPriceHistory.at(-1)?.priceFetchedAt! > Date.now() - ONE_HOUR_IN_MILLIS
    ) {
      return
    }
    dispatch(
      fetchPriceHistoryStart({
        tokenId,
        startTimestamp: Date.now() - ONE_DAY_IN_MILLIS * 30,
        endTimestamp: Date.now(),
      })
    )
  }, [])

  if (tokenPriceHistoryStatus === 'loading' && tokenPriceHistory.length === 0) {
    return <Loader />
  }

  const chartData = []
  let lastTimestampAdded
  for (let i = 0; i < tokenPriceHistory.length; i++) {
    // Only grab one price per chart step & the most recent price
    if (
      lastTimestampAdded &&
      tokenPriceHistory[i].priceFetchedAt - lastTimestampAdded <
        ONE_HOUR_IN_MILLIS * CHART_STEP_IN_HOURS &&
      i !== tokenPriceHistory.length - 1
    ) {
      continue
    } else {
      lastTimestampAdded = tokenPriceHistory[i].priceFetchedAt
      const { priceUsd } = tokenPriceHistory[i]
      const localAmount = dollarsToLocal(priceUsd)
      chartData.push({
        amount: localAmount ? localAmount.toNumber() : 0,
        displayValue: localAmount ? displayLocalCurrency(localAmount) : '',
        priceFetchedAt: tokenPriceHistory[i].priceFetchedAt,
      })
    }
  }

  const RenderPoint = renderPointOnChart(chartData, CHART_WIDTH, colors.black)

  const values = chartData.map((el) => el.amount)
  const min = Math.min(...values)
  const max = Math.max(...values)
  let domain
  // ensure that vertical chart range is at least CHART_MIN_VERTICAL_RANGE
  if (max - min < CHART_MIN_VERTICAL_RANGE) {
    const offset = CHART_MIN_VERTICAL_RANGE - (max - min) / 2
    domain = {
      y: [min - offset, max + offset] as [number, number],
      x: [0, chartData.length - 1] as [number, number],
    }
  }

  const mostRecentTimestamp = chartData.at(-1)?.priceFetchedAt
  const oldestTimestamp = chartData.at(0)?.priceFetchedAt

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <VictoryGroup
        domainPadding={CHART_DOMAIN_PADDING}
        singleQuadrantDomainPadding={false}
        padding={{ left: chartPadding, right: chartPadding }}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        data={chartData.map((el) => el.amount)}
        domain={domain}
      >
        {/* @ts-ignore */}
        <VictoryScatter dataComponent={<RenderPoint />} />
        <VictoryLine
          interpolation="monotoneX"
          style={{
            data: { stroke: colors.black },
          }}
        />
      </VictoryGroup>
      <View style={[styles.range, { paddingHorizontal: chartPadding }]}>
        {oldestTimestamp && (
          <Text style={styles.timeframe}>{formatFeedDate(oldestTimestamp, i18n)}</Text>
        )}
        {mostRecentTimestamp && (
          <Text style={styles.timeframe}>{formatFeedDate(mostRecentTimestamp, i18n)}</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.Thick24,
  },
  loader: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT + 37.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeframe: {
    color: colors.gray3,
    fontSize: 16,
  },
  range: {
    marginTop: variables.contentPadding,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})
