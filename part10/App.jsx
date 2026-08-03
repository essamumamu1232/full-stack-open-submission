import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RepositoryList from './src/components/RepositoryList'
import SignIn from './src/components/SignIn'
import { useState } from 'react'

const httpLink = createHttpLink({ uri: 'https://fullstackopen-4923.fly.dev/graphql' })

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('userToken')
  return { headers: { ...headers, authorization: token ? `Bearer ${token}` : '' } }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const Tab = createBottomTabNavigator()

export default function App() {
  const [token, setToken] = useState(null)
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator>
          <Tab.Screen name="Repositories" component={RepositoryList} />
          <Tab.Screen name="Sign In">
            {() => <SignIn setToken={setToken} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  )
}
