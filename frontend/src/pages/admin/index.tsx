import Head from 'next/head';

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Admin Dashboard - University Grade Management</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="flex items-center">
                <button className="text-gray-600 hover:text-gray-900">Logout</button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Users</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage users and roles</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Courses</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage courses and subjects</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Exams</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage exams and results</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
