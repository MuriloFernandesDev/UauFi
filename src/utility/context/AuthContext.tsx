import { createContext, ReactNode, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

type SignInData = {
  email: string
  password: string
}

type AuthContextType = {
  user: any | null
  signIn: (data: SignInData) => Promise<void>
  signOut: () => void
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null)

  async function signIn({ email, password }: SignInData) {
    try {
      //   const { data } = await axios.post('/api/auth/login', {
      //     email,
      //     password,
      //   })

      console.log(email, password)
    } catch (error: any) {
      console.log(error)
    }
  } //função para realizar login

  async function signOut() {
    try {
      localStorage.removeItem('@UauFi:Token')
      setUser(null)
      //  Router.push('/account/login')
    } catch (err) {
      localStorage.removeItem('@UauFi:Token')
      setUser(null)
      //  Router.push('/account/login')
    }
  } //função para realizar o logout

  useEffect(() => {
    const userSearch = async () => {
      const token = localStorage.getItem('@UauFi:Token')

      //  if (token) {
      //     axios
      //        .get('/api/me')
      //        .then((response) => {
      //           setUser(response.data)
      //        })
      //        .catch(() => {
      //           destroyCookie(null, '@BuyPhone:Token')
      //        })
      //  }
    }
    userSearch()
  }, []) //effect para buscar usuário pelo token

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
