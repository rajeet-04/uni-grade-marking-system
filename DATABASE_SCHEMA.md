# Database Schema — Uni Grade & Exam Management (Simplified)

Rationale
- Use PostgreSQL.
- Use UUID primary keys for most domain tables.
- Normalize relationships: users -> (student|faculty|admin) profiles.

Core Tables (primary columns only)

1. users
- id uuid PK
- email text UNIQUE NOT NULL
- password_hash text NOT NULL
- role varchar NOT NULL -- 'admin' | 'faculty' | 'student'
- name text
- is_active boolean DEFAULT true
- created_at timestamptz DEFAULT now()
- updated_at timestamptz DEFAULT now()

2. students
- id uuid PK
- user_id uuid FK -> users.id UNIQUE
- roll_number text UNIQUE
- enrollment_year int
- department_id uuid FK -> departments.id
- course_id uuid FK -> courses.id
- profile_pic text
- status varchar -- active/inactive
- dob date
- phone text

3. faculties
- id uuid PK
- user_id uuid FK -> users.id UNIQUE
- employee_id text UNIQUE
- department_id uuid FK
- designation text
- phone text

4. admins
- id uuid PK
- user_id uuid FK -> users.id UNIQUE
- notes text

5. departments
- id uuid PK
- name text
- code text UNIQUE

6. courses
- id uuid PK
- name text
- code text
- total_semesters int
- department_id uuid FK

7. subjects
- id uuid PK
- code text
- name text
- course_id uuid FK
- semester_number int
- credits int
- subject_type varchar -- 'theory'|'practical'
- assigned_faculty_id uuid FK -> faculties.id

8. academic_years
- id uuid PK
- label text -- '2024-25'
- start_date date
- end_date date
- current boolean DEFAULT false

9. exams
- id uuid PK
- exam_type varchar -- 'midterm'|'final'|'viva'|'practical'
- name text
- academic_year_id uuid FK
- start_date timestamptz
- end_date timestamptz
- created_by uuid FK -> users.id

10. exam_sessions
- id uuid PK
- exam_id uuid FK -> exams.id
- subject_id uuid FK -> subjects.id
- faculty_id uuid FK -> faculties.id
- date date
- start_time time
- end_time time
- venue text

11. enrolments
- id uuid PK
- student_id uuid FK -> students.id
- course_id uuid FK
- semester_number int
- academic_year_id uuid FK
- is_active boolean

12. marks
- id uuid PK
- student_id uuid FK
- exam_session_id uuid FK
- marks_obtained numeric
- max_marks numeric
- internal_external varchar
- graded_by uuid FK -> faculties.id
- remark text
- created_at timestamptz
- updated_at timestamptz

13. grades
- id uuid PK
- name text -- 'A+', 'A', etc.
- min_mark numeric
- max_mark numeric
- grade_point numeric

14. results
- id uuid PK
- student_id uuid FK
- academic_year_id uuid FK
- semester_number int
- sgpa numeric
- cgpa numeric
- status varchar -- 'pass'|'fail'
- pdf_path text
- published_at timestamptz

15. notifications
- id uuid PK
- user_id uuid NULLABLE
- title text
- body text
- type varchar -- 'email'|'inapp'|'sms'
- sent_at timestamptz
- read_at timestamptz NULLABLE

16. verification_tokens
- id uuid PK
- token text UNIQUE
- resource_type varchar -- 'result'
- resource_id uuid
- signed_hmac text
- created_at timestamptz
- expires_at timestamptz

17. audit_logs
- id uuid PK
- user_id uuid NULLABLE
- action text
- resource_type text
- resource_id uuid NULLABLE
- metadata jsonb
- created_at timestamptz DEFAULT now()

Indexes
- users(email)
- students(roll_number)
- marks(student_id, exam_session_id)
- verification_tokens(token)
- results(student_id, semester_number)

Migrations
- Use Prisma/TypeORM migrations kept in repo under backend/migrations.
- Provide seed script to create initial admin user, default grades table, and sample course/subject data.

Example Prisma model (simplified) - use as starting point
- Provide a separate `schema.prisma` when scaffolding code.

Notes
- Consider separating read-optimized tables or materialized views for rankings.
- Keep sensitive PII encrypted at rest (host disk encryption recommended).