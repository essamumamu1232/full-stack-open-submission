const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message))

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favouriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}
      if (args.genre) query.genres = { $in: [args.genre] }
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) query.author = author._id
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return Promise.all(authors.map(async (author) => {
        const bookCount = await Book.countDocuments({ author: author._id })
        return { ...author.toObject(), id: author._id.toString(), bookCount }
      }))
    },
    me: (root, args, context) => context.currentUser,
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      const book = new Book({ ...args, author: author._id })
      await book.save()
      return book.populate('author')
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })
      }
      return Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      )
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre })
      return user.save()
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', { extensions: { code: 'BAD_USER_INPUT' } })
      }
      const token = { username: user.username, id: user._id }
      return { value: jwt.sign(token, JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req?.headers?.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET)
      const currentUser = await User.findById(decoded.id)
      return { currentUser }
    }
    return {}
  },
}).then(({ url }) => console.log(`Server ready at ${url}`))
