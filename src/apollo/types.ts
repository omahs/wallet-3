/*
 * This file was originally generated by `yarn run build:gen-graphql-types`, but
 * has since been manually edited and graphql codegen has been removed.
 * TODO(any): cleanup unused types from this file
 */

import BigNumber from 'bignumber.js'

export type Maybe<T> = T | null

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Address: string
  Timestamp: number
  Decimal: BigNumber.Value
  Upload: any
}

export interface LocalMoneyAmount {
  __typename?: 'LocalMoneyAmount'
  value: Scalars['Decimal']
  currencyCode: Scalars['String']
  exchangeRate: Scalars['Decimal']
}

export interface MoneyAmount {
  __typename?: 'MoneyAmount'
  value: Scalars['Decimal']
  currencyCode: Scalars['String']
  localAmount?: Maybe<LocalMoneyAmount>
}

export interface ExchangeRateQueryVariables {
  currencyCode: Scalars['String']
  sourceCurrencyCode?: Maybe<Scalars['String']>
}

export interface ExchangeRateQuery {
  __typename?: 'Query'
  currencyConversion: Maybe<{ __typename?: 'ExchangeRate'; rate: BigNumber.Value }>
}

export interface IntrospectionResultData {
  __schema: {
    types: Array<{
      kind: string
      name: string
      possibleTypes: Array<{
        name: string
      }>
    }>
  }
}
export const introspectionQueryResultData: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'Event',
        possibleTypes: [
          {
            name: 'Transfer',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'TokenTransaction',
        possibleTypes: [
          {
            name: 'TokenTransfer',
          },
        ],
      },
    ],
  },
}
