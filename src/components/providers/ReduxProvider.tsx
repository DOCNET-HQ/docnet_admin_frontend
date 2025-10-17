'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/lib/store'
import { Loader } from '@/components/dashboard/loader'

interface ReduxProviderProps {
    children: React.ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
    return (
        <Provider store={store}>
            <PersistGate
                loading={
                    <Loader />
                }
                persistor={persistor}
            >
                {children}
            </PersistGate>
        </Provider>
    )
}
