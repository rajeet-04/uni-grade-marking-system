import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '@/lib/api';

interface Student {
  id: string;
  rollNumber: string;
  user: {
    name: string;
    email: string;
  };
  course?: {
    name: string;
  };
  enrolment?: {
    semesterNumber: number;
  };
}

export default function FacultyDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'FACULTY') {
      router.push('/auth/login');
      return;
    }
    fetchFacultyData(user.id);
  }, []);

  const fetchFacultyData = async (userId: string) => {
    try {
      const facultiesRes = await api.get('/faculties');
      const faculty = facultiesRes.data.find((f: any) => f.userId === userId);
      
      if (faculty) {
        setFacultyId(faculty.id);
        const studentsRes = await api.get(`/faculties/${faculty.id}/students`);
        setStudents(studentsRes.data);
        
        const subjectsRes = await api.get('/subjects');
        const assignedSubjects = subjectsRes.data.filter((s: any) => s.assignedFacultyId === faculty.id);
        setSubjects(assignedSubjects);
      }
    } catch (err) {
      console.error('Failed to fetch faculty data:', err);
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
        <title>Faculty Dashboard - University Grade Management</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Faculty Dashboard</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <p className="text-sm font-medium text-gray-500">My Students</p>
                  <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : students.length}</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <p className="text-sm font-medium text-gray-500">Assigned Subjects</p>
                  <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : subjects.length}</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <p className="text-sm font-medium text-gray-500">Pending Marks</p>
                  <p className="text-3xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">My Subjects</h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <p className="text-gray-500">Loading subjects...</p>
                ) : subjects.length === 0 ? (
                  <p className="text-gray-500">No subjects assigned yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                        <p className="text-sm text-gray-500">Code: {subject.code}</p>
                        <p className="text-sm text-gray-500">Credits: {subject.credits}</p>
                        <p className="text-sm text-gray-500">Semester: {subject.semesterNumber}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">My Students</h3>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="p-6 text-gray-500">Loading students...</p>
                ) : students.length === 0 ? (
                  <p className="p-6 text-gray-500">No students assigned yet. Students will appear here once they enroll in courses where you teach subjects.</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course?.name || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.enrolment?.semesterNumber || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
