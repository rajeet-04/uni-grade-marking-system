import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>University Grade Management System</title>
        <meta name="description" content="University Grade and Exam Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center p-24">
        <div className="max-w-5xl w-full">
          <h1 className="text-6xl font-bold text-center mb-8">
            University Grade Management System
          </h1>
          <p className="text-xl text-center mb-12 text-gray-600">
            A comprehensive system for managing university grades, exams, and student records
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/auth/login" className="p-6 border rounded-lg hover:border-blue-500 transition">
              <h2 className="text-2xl font-semibold mb-2">Login</h2>
              <p className="text-gray-600">Access your account</p>
            </Link>
            <Link href="/admin" className="p-6 border rounded-lg hover:border-blue-500 transition">
              <h2 className="text-2xl font-semibold mb-2">Admin Portal</h2>
              <p className="text-gray-600">Manage system settings</p>
            </Link>
            <Link href="/student" className="p-6 border rounded-lg hover:border-blue-500 transition">
              <h2 className="text-2xl font-semibold mb-2">Student Portal</h2>
              <p className="text-gray-600">View grades and results</p>
            </Link>
          </div>
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Role-based access control (Admin, Faculty, Student)</li>
              <li>✓ Grade and exam management</li>
              <li>✓ CGPA/SGPA calculation</li>
              <li>✓ PDF result generation</li>
              <li>✓ Comprehensive reporting</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}
