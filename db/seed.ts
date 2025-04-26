import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Check if employees table already has data
    const existingEmployees = await db.query.employees.findMany();
    console.log("----",existingEmployees)
    if (existingEmployees.length === 0) {
      console.log("Seeding employees...");
      await db.insert(schema.employees).values([
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          department: "Development",
          position: "Senior Developer",
          employeeId: "EMP001",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          phone: "555-987-6543",
          department: "Marketing",
          position: "Marketing Manager",
          employeeId: "EMP002",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@example.com",
          phone: "555-456-7890",
          department: "Finance",
          position: "Financial Analyst",
          employeeId: "EMP003",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "Sarah",
          lastName: "Adams",
          email: "sarah.adams@example.com",
          phone: "555-234-5678",
          department: "Human Resources",
          position: "HR Manager",
          employeeId: "EMP004",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "Robert",
          lastName: "Johnson",
          email: "robert.johnson@example.com",
          phone: "555-345-6789",
          department: "Development",
          position: "Frontend Developer",
          employeeId: "EMP005",
          status: "on-leave",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "Emily",
          lastName: "Williams",
          email: "emily.williams@example.com",
          phone: "555-456-7890",
          department: "Marketing",
          position: "Content Writer",
          employeeId: "EMP006",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "David",
          lastName: "Brown",
          email: "david.brown@example.com",
          phone: "555-567-8901",
          department: "Finance",
          position: "Accountant",
          employeeId: "EMP007",
          status: "inactive",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // Check if payslips table already has data
    const existingPayslips = await db.query.payslips.findMany();
    if (existingPayslips.length === 0) {
      console.log("Seeding payslips...");
      await db.insert(schema.payslips).values([
        {
          employeeId: 1,
          payPeriodStart: "2023-04-01",
          payPeriodEnd: "2023-04-30",
          issueDate: "2023-05-05",
          basicSalary: "4500.00",
          overtime: "150.00",
          bonus: "200.00",
          tax: "750.00",
          healthInsurance: "150.00",
          retirement: "250.00",
          grossPay: "4850.00",
          totalDeductions: "1150.00",
          netPay: "3700.00",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          employeeId: 2,
          payPeriodStart: "2023-04-01",
          payPeriodEnd: "2023-04-30",
          issueDate: "2023-05-05",
          basicSalary: "3800.00",
          overtime: "0.00",
          bonus: "150.00",
          tax: "650.00",
          healthInsurance: "120.00",
          retirement: "200.00",
          grossPay: "3950.00",
          totalDeductions: "970.00",
          netPay: "2980.00",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          employeeId: 3,
          payPeriodStart: "2023-04-01",
          payPeriodEnd: "2023-04-30",
          issueDate: "2023-05-05",
          basicSalary: "4800.00",
          overtime: "250.00",
          bonus: "200.00",
          tax: "800.00",
          healthInsurance: "160.00",
          retirement: "300.00",
          grossPay: "5250.00",
          totalDeductions: "1260.00",
          netPay: "3990.00",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          employeeId: 4,
          payPeriodStart: "2023-04-01",
          payPeriodEnd: "2023-04-30",
          issueDate: "2023-05-05",
          basicSalary: "4000.00",
          overtime: "0.00",
          bonus: "150.00",
          tax: "700.00",
          healthInsurance: "130.00",
          retirement: "220.00",
          grossPay: "4150.00",
          totalDeductions: "1050.00",
          netPay: "3100.00",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // Check if meetings table already has data
    const existingMeetings = await db.query.meetings.findMany();
    if (existingMeetings.length === 0) {
      console.log("Seeding meetings...");
      await db.insert(schema.meetings).values([
        {
          title: "Quarterly Review",
          description: "Quarterly performance review meeting",
          date: "2023-05-15",
          time: "10:30 AM - 11:30 AM",
          location: "Conference Room A",
          participants: [1, 2, 3, 4, 5],
          status: "today",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Weekly Standup",
          description: "Weekly team status update",
          date: "2023-05-16",
          time: "9:00 AM - 9:30 AM",
          location: "Zoom Meeting",
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          status: "upcoming",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "HR Policy Update",
          description: "HR policy updates and changes",
          date: "2023-05-18",
          time: "2:00 PM - 3:00 PM",
          location: "Conference Room B",
          participants: [1, 2, 4],
          status: "upcoming",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // Check if profile table already has data
    const existingProfile = await db.query.profile.findMany();
    if (existingProfile.length === 0) {
      console.log("Seeding profile...");
      await db.insert(schema.profile).values({
        firstName: "Admin",
        lastName: "User",
        email: "admin@paymeet.com",
        phone: "555-123-4567",
        department: "Administration",
        position: "System Administrator",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Check if payroll stats table already has data
    const existingPayrollStats = await db.query.payrollStats.findMany();
    if (existingPayrollStats.length === 0) {
      console.log("Seeding payroll stats...");
      await db.insert(schema.payrollStats).values({
        month: "April 2023",
        totalSalary: "128450.00",
        overtime: "8245.00",
        bonuses: "6150.00",
        taxDeductions: "32112.50",
        insuranceBenefits: "12845.00",
        netPayroll: "97887.50",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
