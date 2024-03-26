import { View, Text } from 'react-native'
import React from 'react'
import Nothing from '../../components/Nothing'
import Sessions from '../../components/Sessions'

const Page = () => {
  return (
    // <Nothing title='There are no ongoing attendance sessions available for you at the moment.' />
    <Sessions />
  )
}

export default Page