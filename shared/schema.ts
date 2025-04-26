import { pgTable, text, serial, integer, boolean, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Employees Table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  department: text("department"),
  position: text("position"),
  employeeId: text("employee_id").notNull(),
  status: text("status").default('active'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees, {
  firstName: (schema) => schema.min(1, "First name is required"),
  lastName: (schema) => schema.min(1, "Last name is required"),
  email: (schema) => schema.email("Invalid email address"),
  employeeId: (schema) => schema.min(1, "Employee ID is required"),
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Payslips Table
export const payslips = pgTable("payslips", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  payPeriodStart: text("pay_period_start").notNull(),
  payPeriodEnd: text("pay_period_end").notNull(),
  issueDate: text("issue_date").notNull(),
  basicSalary: numeric("basic_salary", { precision: 10, scale: 2 }).notNull(),
  overtime: numeric("overtime", { precision: 10, scale: 2 }).default("0"),
  bonus: numeric("bonus", { precision: 10, scale: 2 }).default("0"),
  tax: numeric("tax", { precision: 10, scale: 2 }).notNull(),
  healthInsurance: numeric("health_insurance", { precision: 10, scale: 2 }).notNull(),
  retirement: numeric("retirement", { precision: 10, scale: 2 }).notNull(),
  grossPay: numeric("gross_pay", { precision: 10, scale: 2 }).notNull(),
  totalDeductions: numeric("total_deductions", { precision: 10, scale: 2 }).notNull(),
  netPay: numeric("net_pay", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payslipsRelations = relations(payslips, ({ one }) => ({
  employee: one(employees, {
    fields: [payslips.employeeId],
    references: [employees.id],
  }),
}));

// Meetings Table
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  participants: jsonb("participants").default([]),
  status: text("status").default('upcoming'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Profile Table
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  department: text("department"),
  position: text("position"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payroll Stats Table
export const payrollStats = pgTable("payroll_stats", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  totalSalary: numeric("total_salary", { precision: 10, scale: 2 }).notNull(),
  overtime: numeric("overtime", { precision: 10, scale: 2 }).notNull(),
  bonuses: numeric("bonuses", { precision: 10, scale: 2 }).notNull(),
  taxDeductions: numeric("tax_deductions", { precision: 10, scale: 2 }).notNull(),
  insuranceBenefits: numeric("insurance_benefits", { precision: 10, scale: 2 }).notNull(),
  netPayroll: numeric("net_payroll", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
