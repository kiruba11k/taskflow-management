'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Dashboard from '@/components/pages/Dashboard'
import Layout from '@/components/layout/Layout'

export default function HomePage() {
  const router = useRouter()

  return (
    <Layout currentPageName="Dashboard">
      <Dashboard />
    </Layout>
  )
}
