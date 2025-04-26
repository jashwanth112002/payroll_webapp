import type { Express } from "express";
import { createServer, type Server } from "http";
// We're using Drizzle directly instead of storage wrapper
import multer from "multer";
import path from "path";
import { db } from "@db";
import fs from "fs";
import {
  employees,
  payslips,
  profile,
  meetings,
  payrollStats
} from "@shared/schema";
import { eq } from "drizzle-orm";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Employees API
  app.get('/api/employees', async (req, res) => {
    try {
      const allEmployees = await db.query.employees.findMany();
      res.json(allEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get('/api/employees/stats', async (req, res) => {
    try {
      const allEmployees = await db.query.employees.findMany();
      
      const stats = {
        total: allEmployees.length,
        active: allEmployees.filter(e => e.status === 'active').length,
        onLeave: allEmployees.filter(e => e.status === 'on-leave').length,
        inactive: allEmployees.filter(e => e.status === 'inactive').length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      res.status(500).json({ message: "Failed to fetch employee statistics" });
    }
  });
  
  // Add a new employee
  app.post('/api/employees', async (req, res) => {
    try {
      const employeeData = req.body;
      
      // Insert the new employee
      const result = await db.insert(employees).values({
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      res.status(201).json(result[0]);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Failed to create employee" });
    }
  });
  
  // Update an employee
  app.patch('/api/employees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const employeeData = req.body;
      
      // Update the employee
      const result = await db.update(employees)
        .set({
          ...employeeData,
          updatedAt: new Date()
        })
        .where(eq(employees.id, parseInt(id)))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Failed to update employee" });
    }
  });
  
  // Delete an employee
  app.delete('/api/employees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Delete the employee
      const result = await db.delete(employees)
        .where(eq(employees.id, parseInt(id)))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Payslips API
  app.get('/api/payslips', async (req, res) => {
    try {
      const allPayslips = await db.query.payslips.findMany();
      res.json(allPayslips);
    } catch (error) {
      console.error("Error fetching payslips:", error);
      res.status(500).json({ message: "Failed to fetch payslips" });
    }
  });

  app.get('/api/payslips/recent', async (req, res) => {
    try {
      const recentPayslips = await db.query.payslips.findMany({
        orderBy: (payslips, { desc }) => [desc(payslips.issueDate)],
        limit: 5
      });
      res.json(recentPayslips);
    } catch (error) {
      console.error("Error fetching recent payslips:", error);
      res.status(500).json({ message: "Failed to fetch recent payslips" });
    }
  });
  
  // Create a new payslip
  app.post('/api/payslips', async (req, res) => {
    try {
      const payslipData = req.body;
      
      // Insert the new payslip
      const result = await db.insert(payslips).values({
        ...payslipData,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      res.status(201).json(result[0]);
    } catch (error) {
      console.error("Error creating payslip:", error);
      res.status(500).json({ message: "Failed to create payslip" });
    }
  });

  // Meetings API
  app.get('/api/meetings/upcoming', async (req, res) => {
    try {
      const upcomingMeetings = await db.query.meetings.findMany({
        where: (meetings, { eq, gte }) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return gte(meetings.date, today.toISOString());
        },
        orderBy: (meetings, { asc }) => [asc(meetings.date)],
        limit: 3
      });
      res.json(upcomingMeetings);
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
      res.status(500).json({ message: "Failed to fetch upcoming meetings" });
    }
  });
  
  // Get all meetings
  app.get('/api/meetings', async (req, res) => {
    try {
      const allMeetings = await db.query.meetings.findMany();
      res.json(allMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });
  
  // Create a new meeting
  app.post('/api/meetings', async (req, res) => {
    try {
      const meetingData = req.body;
      
      // Format the time field from startTime and endTime
      const time = meetingData.startTime && meetingData.endTime 
        ? `${meetingData.startTime} - ${meetingData.endTime}` 
        : "00:00 - 00:00";
      
      // Insert the new meeting
      const result = await db.insert(meetings).values({
        title: meetingData.title,
        description: meetingData.description || "",
        date: meetingData.date,
        time: time, // Use the formatted time string
        location: meetingData.location,
        participants: meetingData.participants || [],
        status: meetingData.status || "upcoming",
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      // Return the newly created meeting
      res.status(201).json(result[0]);
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ message: "Failed to create meeting" });
    }
  });

  // Payroll Stats API
  app.get('/api/payroll/stats', async (req, res) => {
    try {
      const stats = await db.query.payrollStats.findFirst({
        where: (payrollStats, { eq }) => eq(payrollStats.month, 'April 2023')
      });
      res.json(stats);
    } catch (error) {
      console.error("Error fetching payroll stats:", error);
      res.status(500).json({ message: "Failed to fetch payroll statistics" });
    }
  });

  // Profile API
  app.get('/api/profile', async (req, res) => {
    try {
      // For demo purposes, get the first profile
      const userProfile = await db.query.profile.findFirst();
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch('/api/profile', async (req, res) => {
    try {
      const updateData = req.body;
      
      // For demo, we'll update the profile with id 1
      const id = 1;
      
      // Update the profile
      await db.update(profile)
        .set({
          ...updateData,
          updatedAt: new Date() // Use Date object directly, not string
        })
        .where(eq(profile.id, id));
      
      // Fetch the updated profile
      const updatedProfile = await db.query.profile.findFirst({
        where: (profile, { eq }) => eq(profile.id, id)
      });
      
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/profile/:id/photo', upload.single('photo'), async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log("Photo upload request received for profile ID:", id);
      console.log("File object:", req.file ? 'File received' : 'No file in request');
      
      // Type assertion for file
      const file = req.file as any;
      
      if (!file) {
        console.error("No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Get the file URL
      const fileUrl = `/uploads/${file.filename}`;
      
      console.log("Photo upload successful, file info:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        filename: file.filename,
        destination: file.destination,
        url: fileUrl
      });
      
      try {
        // Update the profile with the new photo URL
        await db.update(profile)
          .set({
            photoUrl: fileUrl,
            updatedAt: new Date()
          })
          .where(eq(profile.id, parseInt(id)));
          
        console.log("Profile successfully updated with new photo URL");
        
        res.json({ message: "Photo uploaded successfully", photoUrl: fileUrl });
      } catch (dbError) {
        console.error("Database error while updating profile:", dbError);
        res.status(500).json({ message: "Failed to update profile with new photo" });
      }
    } catch (error) {
      console.error("Error during photo upload process:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // Serve static files from the uploads directory
  app.use('/uploads', (req, res, next) => {
    // Make sure we're getting a clean URL by removing query parameters
    const cleanUrl = req.url.split('?')[0];
    const filePath = path.join(process.cwd(), 'uploads', cleanUrl);
    
    console.log('Attempting to serve file from:', filePath);
    
    // Check if file exists first
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File does not exist at path: ${filePath}`, err);
        return next(); // File doesn't exist, move to next middleware
      }
      
      // Set appropriate cache control and content type headers
      res.setHeader('Cache-Control', 'no-cache');
      
      // Determine content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (ext === '.png') {
        res.setHeader('Content-Type', 'image/png');
      } else if (ext === '.gif') {
        res.setHeader('Content-Type', 'image/gif');
      } else if (ext === '.svg') {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
      
      // Send the file
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error serving file:', err);
          next(); // If error occurred, continue to next middleware
        } else {
          console.log('Successfully served file:', filePath);
        }
      });
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
