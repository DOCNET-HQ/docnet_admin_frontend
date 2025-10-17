'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Loader } from '@/components/dashboard/loader'
import { selectIsAuthenticated } from '@/lib/store/slices/authSlice'

interface ProtectedPageProps {
    children: React.ReactNode
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return <Loader />
    }

    return <>{children}</>
}

export default ProtectedPage
