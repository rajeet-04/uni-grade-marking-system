import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    enrolments: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [students, courses, enrolments] = await Promise.all([
        api.get('/students'),
        api.get('/courses'),
        api.get('/enrolments'),
      ]);
      setStats({
        students: students.data.length,
        faculty: 0,
        courses: courses.data.length,
        enrolments: enrolments.data.length,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - University Grade Management</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex space-x-4">
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
                  <Link href="/admin/enrolments" className="text-gray-700 hover:text-gray-900">Enrolments</Link>
                  <Link href="/admin/students" className="text-gray-700 hover:text-gray-900">Students</Link>
                  <Link href="/admin/courses" className="text-gray-700 hover:text-gray-900">Courses</Link>
                </div>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Total Students</p>
                      <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : stats.students}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Total Courses</p>
                      <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : stats.courses}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Active Enrolments</p>
                      <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : stats.enrolments}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Faculty Members</p>
                      <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : stats.faculty}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/admin/enrolments" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Student Enrollment</h3>
                  <p className="mt-1 text-sm text-gray-500">Enroll students in courses and manage enrollments</p>
                </div>
              </Link>
              <Link href="/admin/courses" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Courses & Subjects</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage courses, subjects, and faculty assignments</p>
                </div>
              </Link>
              <Link href="/admin/students" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Students</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage student information</p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
