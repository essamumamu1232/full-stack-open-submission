import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'

const GET_REPOSITORIES = gql`
  query GetRepositories($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String) {
    repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword) {
      edges {
        node {
          id
          fullName
          description
          language
          forksCount
          stargazersCount
          ratingAverage
          reviewCount
          ownerAvatarUrl
        }
      }
    }
  }
`

const formatCount = (count) => count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count)

const RepositoryItem = ({ item }) => (
  <View style={styles.card} testID="repositoryItem">
    <View style={styles.header}>
      <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.fullName}>{item.fullName}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        {item.language && <View style={styles.badge}><Text style={styles.badgeText}>{item.language}</Text></View>}
      </View>
    </View>
    <View style={styles.stats}>
      {[['Stars', item.stargazersCount], ['Forks', item.forksCount], ['Reviews', item.reviewCount], ['Rating', item.ratingAverage]].map(([label, val]) => (
        <View key={label} style={styles.stat}>
          <Text style={styles.statValue}>{formatCount(val)}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      ))}
    </View>
  </View>
)

const RepositoryList = () => {
  const [orderBy, setOrderBy] = useState('CREATED_AT')
  const [orderDirection, setOrderDirection] = useState('DESC')
  const { loading, data } = useQuery(GET_REPOSITORIES, {
    variables: { orderBy, orderDirection },
    fetchPolicy: 'cache-and-network',
  })

  const repos = data?.repositories?.edges?.map(e => e.node) ?? []

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.sortRow}>
        {[
          { label: 'Latest', ob: 'CREATED_AT', od: 'DESC' },
          { label: 'Highest rated', ob: 'RATING_AVERAGE', od: 'DESC' },
          { label: 'Lowest rated', ob: 'RATING_AVERAGE', od: 'ASC' },
        ].map(({ label, ob, od }) => (
          <TouchableOpacity key={label} style={[styles.sortBtn, orderBy === ob && orderDirection === od && styles.sortActive]}
            onPress={() => { setOrderBy(ob); setOrderDirection(od) }}>
            <Text style={orderBy === ob && orderDirection === od ? styles.sortTextActive : styles.sortText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading
        ? <Text style={{ padding: 16 }}>Loading...</Text>
        : <FlatList data={repos} keyExtractor={item => item.id} renderItem={({ item }) => <RepositoryItem item={item} />} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  header: { flexDirection: 'row' },
  avatar: { width: 48, height: 48, borderRadius: 4, marginRight: 12 },
  info: { flex: 1 },
  fullName: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  description: { color: '#586069', fontSize: 13, marginBottom: 6 },
  badge: { backgroundColor: '#0075ca', borderRadius: 4, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e1e4e8' },
  stat: { alignItems: 'center' },
  statValue: { fontWeight: 'bold', fontSize: 14 },
  statLabel: { color: '#586069', fontSize: 12, marginTop: 2 },
  sortRow: { flexDirection: 'row', padding: 8, backgroundColor: '#f6f8fa', flexWrap: 'wrap' },
  sortBtn: { margin: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, borderWidth: 1, borderColor: '#0366d6' },
  sortActive: { backgroundColor: '#0366d6' },
  sortText: { color: '#0366d6', fontSize: 12 },
  sortTextActive: { color: '#fff', fontSize: 12 },
})

export default RepositoryList
