import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth'
import { RecoilRoot } from 'recoil'
import Modal from '../components/Modal'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AuthProvider>
        <Component {...pageProps} />
        <Modal/>
      </AuthProvider>
    </RecoilRoot>
  )
}

export default MyApp