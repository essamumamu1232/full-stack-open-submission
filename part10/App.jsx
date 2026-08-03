import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { useState } from 'react'

const repositories = [
  { id: '1', fullName: 'jaredpalmer/formik', description: 'Build forms in React, without the tears', language: 'TypeScript', forksCount: 1589, stargazersCount: 21553, ratingAverage: 88, reviewCount: 4 },
  { id: '2', fullName: 'async-library/react-async', description: 'Flexible promise-based React data fetching', language: 'JavaScript', forksCount: 69, stargazersCount: 1820, ratingAverage: 72, reviewCount: 3 },
  { id: '3', fullName: 'prettier/prettier', description: 'Prettier is an opinionated code formatter', language: 'JavaScript', forksCount: 1243, stargazersCount: 36308, ratingAverage: 58, reviewCount: 7 },
]

const RepositoryItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.fullName}>{item.fullName}</Text>
    <Text style={styles.description}>{item.description}</Text>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{item.language}</Text>
    </View>
    <View style={styles.stats}>
      <Text style={styles.stat}>⭐ {item.stargazersCount}</Text>
      <Text style={styles.stat}>🍴 {item.forksCount}</Text>
      <Text style={styles.stat}>📝 {item.reviewCount} reviews</Text>
      <Text style={styles.stat}>⚡ {item.ratingAverage}</Text>
    </View>
  </View>
)

export default function App() {
  const [order, setOrder] = useState('latest')
  const sorted = [...repositories].sort((a, b) =>
    order === 'highest' ? b.ratingAverage - a.ratingAverage :
    order === 'lowest' ? a.ratingAverage - b.ratingAverage : 0
  )

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Rate Repository App</Text>
      <View style={styles.sortBar}>
        {['latest', 'highest', 'lowest'].map(o => (
          <TouchableOpacity key={o} onPress={() => setOrder(o)} style={[styles.sortBtn, order === o && styles.sortActive]}>
            <Text style={order === o ? styles.sortTextActive : styles.sortText}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RepositoryItem item={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', paddingTop: 50 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 16, backgroundColor: '#24292e', color: '#fff' },
  sortBar: { flexDirection: 'row', justifyContent: 'center', padding: 8, backgroundColor: '#fff' },
  sortBtn: { marginHorizontal: 8, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#0366d6' },
  sortActive: { backgroundColor: '#0366d6' },
  sortText: { color: '#0366d6' },
  sortTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 8, elevation: 2 },
  fullName: { fontWeight: 'bold', fontSize: 16 },
  description: { color: '#555', marginVertical: 4 },
  badge: { backgroundColor: '#0366d6', borderRadius: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, marginVertical: 4 },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  stat: { fontSize: 12, color: '#444' },
})
