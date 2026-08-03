import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client'
import { useState } from 'react'
import { gql } from '@apollo/client'

// Exercise 8.13: Fragment
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    genres
    author {
      name
    }
  }
`

const ALL_AUTHORS = gql`
  query { allAuthors { name born bookCount id } }
`
const ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) { ...BookDetails }
  }
  ${BOOK_DETAILS}
`
const ME = gql`
  query { me { username favouriteGenre } }
`
const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) { name born }
  }
`
const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) { value }
  }
`
// Exercise 8.23: Subscription
const BOOK_ADDED = gql`
  subscription { bookAdded { ...BookDetails } }
  ${BOOK_DETAILS}
`

const Authors = ({ token }) => {
  const { loading, data } = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [{ query: ALL_AUTHORS }] })

  if (loading) return <div>Loading...</div>
  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr><th>name</th><th>born</th><th>books</th></tr>
          {data.allAuthors.map(a => (
            <tr key={a.id}><td>{a.name}</td><td>{a.born || '–'}</td><td>{a.bookCount}</td></tr>
          ))}
        </tbody>
      </table>
      {token && (
        <div>
          <h3>Set birth year</h3>
          <select value={name} onChange={e => setName(e.target.value)}>
            <option value="">select author</option>
            {data.allAuthors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <input type="number" value={born} onChange={e => setBorn(e.target.value)} placeholder="born" />
          <button onClick={() => editAuthor({ variables: { name, born: parseInt(born) } })}>update</button>
        </div>
      )}
    </div>
  )
}

const Books = () => {
  const [genre, setGenre] = useState(null)
  const { loading, data } = useQuery(ALL_BOOKS, { variables: { genre } })
  const allBooksData = useQuery(ALL_BOOKS)

  const genres = allBooksData.data
    ? [...new Set(allBooksData.data.allBooks.flatMap(b => b.genres))]
    : []

  if (loading) return <div>Loading...</div>
  return (
    <div>
      <h2>Books</h2>
      <div>
        <button onClick={() => setGenre(null)}>all genres</button>
        {genres.map(g => <button key={g} onClick={() => setGenre(g)}>{g}</button>)}
      </div>
      <table>
        <tbody>
          <tr><th>title</th><th>author</th><th>published</th></tr>
          {data.allBooks.map(b => (
            <tr key={b.id}><td>{b.title}</td><td>{b.author.name}</td><td>{b.published}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Recommended = ({ token }) => {
  const meResult = useQuery(ME)
  const genre = meResult.data?.me?.favouriteGenre
  const { loading, data } = useQuery(ALL_BOOKS, { variables: { genre }, skip: !genre })
  if (!token || loading || !data) return null
  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favourite genre <strong>{genre}</strong></p>
      <table>
        <tbody>
          <tr><th>title</th><th>author</th><th>published</th></tr>
          {data.allBooks.map(b => (
            <tr key={b.id}><td>{b.title}</td><td>{b.author.name}</td><td>{b.published}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (e) => setError(e.graphQLErrors[0]?.message || e.message),
    update: (cache, { data }) => {
      cache.updateQuery({ query: ALL_BOOKS, variables: {} }, (existing) => {
        if (!existing) return { allBooks: [data.addBook] }
        return { allBooks: existing.allBooks.concat(data.addBook) }
      })
    },
  })

  const submit = (e) => {
    e.preventDefault()
    addBook({ variables: { title, author, published: parseInt(published), genres } })
    setTitle(''); setAuthor(''); setPublished(''); setGenres([])
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>title <input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div>author <input value={author} onChange={e => setAuthor(e.target.value)} /></div>
        <div>published <input type="number" value={published} onChange={e => setPublished(e.target.value)} /></div>
        <div>
          <input value={genre} onChange={e => setGenre(e.target.value)} />
          <button type="button" onClick={() => { setGenres(genres.concat(genre)); setGenre('') }}>add genre</button>
        </div>
        <div>genres: {genres.join(', ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

const LoginForm = ({ setToken, setError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useMutation(LOGIN, { onError: (e) => setError(e.graphQLErrors[0]?.message) })
  const submit = async (e) => {
    e.preventDefault()
    const result = await login({ variables: { username, password } })
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }
  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <div>username <input value={username} onChange={e => setUsername(e.target.value)} /></div>
      <div>password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
      <button type="submit">login</button>
    </form>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [error, setError] = useState(null)
  const client = useApolloClient()

  // Exercise 8.23: subscription
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added: ${addedBook.title}`)
      client.cache.updateQuery({ query: ALL_BOOKS, variables: {} }, (existing) => {
        if (!existing) return { allBooks: [addedBook] }
        if (existing.allBooks.find(b => b.id === addedBook.id)) return existing
        return { allBooks: existing.allBooks.concat(addedBook) }
      })
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
          ? <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommended')}>recommended</button>
              <button onClick={logout}>logout</button>
            </>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {page === 'authors' && <Authors token={token} />}
      {page === 'books' && <Books />}
      {page === 'add' && <NewBook setError={setError} />}
      {page === 'recommended' && <Recommended token={token} />}
      {page === 'login' && <LoginForm setToken={setToken} setError={setError} />}
    </div>
  )
}

export default App
