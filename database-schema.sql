-- This is a reference SQL schema for the PayrollPro application
-- You don't need to run this file directly, use npm run db:push instead
-- This is just for reference to understand the database structure

CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'employee',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "profile" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "users"("id"),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "department" TEXT,
    "position" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "country" TEXT,
    "photo_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "employees" (
    "id" SERIAL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT,
    "department" TEXT,
    "position" TEXT,
    "joining_date" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL UNIQUE,
    "basic_salary" NUMERIC(10, 2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "payslips" (
    "id" SERIAL PRIMARY KEY,
    "employee_id" INTEGER REFERENCES "employees"("id"),
    "pay_period_start" TEXT NOT NULL,
    "pay_period_end" TEXT NOT NULL,
    "issue_date" TEXT NOT NULL,
    "basic_salary" NUMERIC(10, 2) NOT NULL,
    "overtime" NUMERIC(10, 2) NOT NULL DEFAULT 0,
    "bonus" NUMERIC(10, 2) NOT NULL DEFAULT 0,
    "tax" NUMERIC(10, 2) NOT NULL DEFAULT 0,
    "health_insurance" NUMERIC(10, 2) NOT NULL DEFAULT 0,
    "retirement" NUMERIC(10, 2) NOT NULL DEFAULT 0,
    "gross_pay" NUMERIC(10, 2) NOT NULL,
    "total_deductions" NUMERIC(10, 2) NOT NULL,
    "net_pay" NUMERIC(10, 2) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "meetings" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "meeting_participants" (
    "id" SERIAL PRIMARY KEY,
    "meeting_id" INTEGER REFERENCES "meetings"("id") ON DELETE CASCADE,
    "employee_id" INTEGER REFERENCES "employees"("id") ON DELETE CASCADE,
    UNIQUE ("meeting_id", "employee_id")
);

CREATE TABLE IF NOT EXISTS "payroll_stats" (
    "id" SERIAL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "total_salary" NUMERIC(10, 2) NOT NULL,
    "average_salary" NUMERIC(10, 2) NOT NULL,
    "total_overtime" NUMERIC(10, 2) NOT NULL,
    "total_bonus" NUMERIC(10, 2) NOT NULL,
    "total_deductions" NUMERIC(10, 2) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_employee_id" ON "payslips"("employee_id");
CREATE INDEX IF NOT EXISTS "idx_meeting_participants_meeting_id" ON "meeting_participants"("meeting_id");
CREATE INDEX IF NOT EXISTS "idx_meeting_participants_employee_id" ON "meeting_participants"("employee_id");