import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/lib/api';

export default function EnrolmentsPage() {
  const router = useRouter();
  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    semesterNumber: 1,
    academicYearId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrolRes, studRes, courseRes, yearRes] = await Promise.all([
        api.get('/enrolments'),
        api.get('/students'),
        api.get('/courses'),
        api.get('/academic-years'),
      ]);
      setEnrolments(enrolRes.data);
      setStudents(studRes.data);
      setCourses(courseRes.data);
      setAcademicYears(yearRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/enrolments', formData);
      setShowModal(false);
      fetchData();
      setFormData({
        studentId: '',
        courseId: '',
        semesterNumber: 1,
        academicYearId: '',
        isActive: true,
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create enrolment');
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
        <title>Manage Enrolments - Admin</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex space-x-4">
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
                  <Link href="/admin/enrolments" className="text-gray-900 font-medium">Enrolments</Link>
                  <Link href="/admin/students" className="text-gray-700 hover:text-gray-900">Students</Link>
                  <Link href="/admin/courses" className="text-gray-700 hover:text-gray-900">Courses</Link>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Student Enrolments</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Enroll Student
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrolments.map((enrolment) => (
                      <tr key={enrolment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{enrolment.student?.user?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enrolment.student?.rollNumber || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enrolment.course?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enrolment.semesterNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${enrolment.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {enrolment.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Enroll Student</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user?.name} ({student.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester Number</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.semesterNumber}
                    onChange={(e) => setFormData({ ...formData, semesterNumber: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.academicYearId}
                    onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.label}
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
                  Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
