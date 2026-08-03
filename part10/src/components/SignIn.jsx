import { View, TextInput, Pressable, Text, StyleSheet, Alert } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SIGN_IN = gql`
  mutation Authorize($credentials: AuthorizeInput) {
    authorize(credentials: $credentials) {
      accessToken
    }
  }
`

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})

const SignIn = ({ setToken }) => {
  const [signIn] = useMutation(SIGN_IN)

  const onSubmit = async (values) => {
    const { username, password } = values
    try {
      const { data } = await signIn({ variables: { credentials: { username, password } } })
      const token = data.authorize.accessToken
      await AsyncStorage.setItem('userToken', token)
      setToken(token)
    } catch (e) {
      Alert.alert('Error', e.message)
    }
  }

  return (
    <Formik initialValues={{ username: '', password: '' }} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <TextInput
            testID="usernameField"
            style={[styles.input, touched.username && errors.username && styles.inputError]}
            placeholder="Username"
            value={values.username}
            onChangeText={handleChange('username')}
            autoCapitalize="none"
          />
          {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}
          <TextInput
            testID="passwordField"
            style={[styles.input, touched.password && errors.password && styles.inputError]}
            placeholder="Password"
            value={values.password}
            onChangeText={handleChange('password')}
            secureTextEntry
          />
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
          <Pressable testID="submitButton" onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 12, marginBottom: 8, fontSize: 15 },
  inputError: { borderColor: '#d73a4a' },
  error: { color: '#d73a4a', marginBottom: 8, fontSize: 12 },
  button: { backgroundColor: '#0366d6', borderRadius: 4, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
})

export default SignIn
