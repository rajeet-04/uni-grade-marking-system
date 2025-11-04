import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '@/lib/api';

interface Enrolment {
  id: string;
  semesterNumber: number;
  isActive: boolean;
  course: {
    name: string;
    code: string;
  };
  academicYear: {
    label: string;
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'STUDENT') {
      router.push('/auth/login');
      return;
    }
    fetchStudentData(user.id);
  }, []);

  const fetchStudentData = async (userId: string) => {
    try {
      const studentsRes = await api.get('/students');
      const student = studentsRes.data.find((s: any) => s.userId === userId);
      
      if (student) {
        setStudentInfo(student);
        const enrolmentsRes = await api.get(`/enrolments/student/${student.id}`);
        setEnrolments(enrolmentsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch student data:', err);
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
        <title>Student Dashboard - University Grade Management</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Student Dashboard</h1>
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
            {studentInfo && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{studentInfo.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Roll Number</p>
                    <p className="font-medium">{studentInfo.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{studentInfo.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{studentInfo.department?.name || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <p className="text-sm font-medium text-gray-500">Active Enrollments</p>
                  <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : enrolments.filter(e => e.isActive).length}</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <p className="text-sm font-medium text-gray-500">Current CGPA</p>
                  <p className="text-3xl font-semibold text-gray-900">-</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <p className="text-sm font-medium text-gray-500">Completed Credits</p>
                  <p className="text-3xl font-semibold text-gray-900">-</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">My Enrollments</h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <p className="text-gray-500">Loading enrollments...</p>
                ) : enrolments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You are not enrolled in any courses yet.</p>
                    <p className="text-sm text-gray-400">Please contact the admin to enroll in courses.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolments.map((enrolment) => (
                      <div key={enrolment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{enrolment.course.name}</h4>
                            <p className="text-sm text-gray-500">Code: {enrolment.course.code}</p>
                            <p className="text-sm text-gray-500">Semester: {enrolment.semesterNumber}</p>
                            <p className="text-sm text-gray-500">Academic Year: {enrolment.academicYear.label}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            enrolment.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {enrolment.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
