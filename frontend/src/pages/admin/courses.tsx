import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/lib/api';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    totalSemesters: 8,
    departmentId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, subjectsRes, deptsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/subjects'),
        api.get('/departments'),
      ]);
      setCourses(coursesRes.data);
      setSubjects(subjectsRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/courses', formData);
      setShowModal(false);
      fetchData();
      setFormData({
        name: '',
        code: '',
        totalSemesters: 8,
        departmentId: '',
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create course');
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
        <title>Manage Courses - Admin</title>
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
                  <Link href="/admin/courses" className="text-gray-900 font-medium">Courses</Link>
                </div>
              </div>
              <div className="flex items-center">
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Courses</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Course
                </button>
              </div>
              {loading ? (
                <p>Loading...</p>
              ) : courses.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <p className="text-gray-500">No courses available yet.</p>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Semesters</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{course.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{course.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{course.totalSemesters}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{course.department?.name || 'Not assigned'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Subjects</h2>
              {loading ? (
                <p>Loading...</p>
              ) : subjects.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <p className="text-gray-500">No subjects available yet.</p>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Faculty</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subjects.map((subject) => (
                        <tr key={subject.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{subject.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{subject.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{subject.course?.name || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{subject.semesterNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{subject.credits}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {subject.assignedFaculty?.user?.name || 'Not assigned'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Course</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Code</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., BSC-CS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Semesters</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.totalSemesters}
                    onChange={(e) => setFormData({ ...formData, totalSemesters: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
