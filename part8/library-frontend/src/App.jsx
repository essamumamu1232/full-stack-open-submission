import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { gql } from '@apollo/client'

const ALL_AUTHORS = gql`
  query { allAuthors { name born bookCount id } }
`
const ALL_BOOKS = gql`
  query AllBooks($genre: String) { allBooks(genre: $genre) { title author { name } published genres id } }
`
const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title id
    }
  }
`
const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) { value }
  }
`

const Authors = () => {
  const { loading, data } = useQuery(ALL_AUTHORS)
  if (loading) return <div>Loading...</div>
  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr><th>name</th><th>born</th><th>books</th></tr>
          {data.allAuthors.map(a => (
            <tr key={a.id}><td>{a.name}</td><td>{a.born}</td><td>{a.bookCount}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Books = () => {
  const { loading, data } = useQuery(ALL_BOOKS)
  if (loading) return <div>Loading...</div>
  return (
    <div>
      <h2>Books</h2>
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
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (e) => setError(e.graphQLErrors[0].message),
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
        <div>title <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>published <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
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
  const [login] = useMutation(LOGIN, {
    onError: (e) => setError(e.graphQLErrors[0].message),
  })
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
      <div>username <input value={username} onChange={({ target }) => setUsername(target.value)} /></div>
      <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
      <button type="submit">login</button>
    </form>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [error, setError] = useState(null)

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}
      {page === 'add' && <NewBook setError={setError} />}
      {page === 'login' && <LoginForm setToken={setToken} setError={setError} />}
    </div>
  )
}

export default App
