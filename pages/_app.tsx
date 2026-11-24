import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth'
import { Provider } from 'jotai'
import Modal from '../components/Modal'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <AuthProvider>
        <Component {...pageProps} />
        <Modal/>
      </AuthProvider>
    </Provider>
  )
}

export default MyApp