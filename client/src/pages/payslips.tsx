import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { 
  Eye, 
  Download, 
  Plus, 
  Filter,
  Calendar,
  User,
  IndianRupee
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "../components/ui/dialog";
import { formatDate, formatCurrency, stringToColor } from "../lib/utils";

type Payslip = {
  id: number;
  employeeId: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  issueDate: string;
  basicSalary: number;
  overtime: number;
  bonus: number;
  tax: number;
  healthInsurance: number;
  retirement: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
};

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  employeeId: string;
};

export default function Payslips() {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: payslips = [] } = useQuery<Payslip[]>({
    queryKey: ['/api/payslips'],
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const findEmployee = (employeeId: number) => {
    return employees.find(employee => employee.id === employeeId);
  };

  // Custom function to format currency for PDF (ensuring the INR symbol appears correctly)
  // Using "Rs." prefix instead of the ₹ symbol to avoid font/encoding issues in PDF
  const formatCurrencyForPDF = (amount: number): string => {
    return `Rs. ${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      useGrouping: true
    }).format(amount)}`;
  };

  const generatePayslipPDF = (payslip: Payslip, employee: Employee) => {
    // Create a new PDF with advanced font options
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });
    
    // Add a currency header for the PDF
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("* All monetary values are in Indian Rupees (INR)", 105, 10, { align: "center" });
    
    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("PAYROLL APP", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("SAI ARUNACHALA PG, BANGALORE", 105, 27, { align: "center" });
    doc.text("jashwanth@gmail.com | 978764578", 105, 32, { align: "center" });
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text("PAYSLIP", 105, 45, { align: "center" });
    
    // Add payslip details
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    // Employee information section
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 50, 182, 25, "F");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Employee Details", 16, 57);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${employee.firstName} ${employee.lastName}`, 16, 65);
    doc.text(`Position: ${employee.position}`, 16, 71);
    
    doc.text(`Employee ID: ${employee.employeeId}`, 105, 65);
    doc.text(`Department: ${employee.department}`, 105, 71);
    
    // Pay period information
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 80, 182, 18, "F");
    
    doc.setFont("helvetica", "bold");
    doc.text("Pay Period Information", 16, 87);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Pay Period: ${formatDate(new Date(payslip.payPeriodStart))} - ${formatDate(new Date(payslip.payPeriodEnd))}`, 16, 94);
    doc.text(`Issue Date: ${formatDate(new Date(payslip.issueDate))}`, 105, 94);
    
    // Earnings
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 103, 85, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Earnings", 55, 110, { align: "center" });
    
    // Deductions
    doc.setFillColor(240, 240, 240);
    doc.rect(111, 103, 85, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Deductions", 150, 110, { align: "center" });
    
    // Earnings details
    doc.setFont("helvetica", "normal");
    
    let yPos = 122;
    
    // Line
    doc.line(14, yPos - 7, 99, yPos - 7);
    doc.line(111, yPos - 7, 196, yPos - 7);
    
    // Earnings table
    doc.text("Basic Salary", 16, yPos);
    doc.text(formatCurrencyForPDF(payslip.basicSalary), 80, yPos, { align: "right" });
    yPos += 7;
    
    doc.text("Overtime", 16, yPos);
    doc.text(formatCurrencyForPDF(payslip.overtime), 80, yPos, { align: "right" });
    yPos += 7;
    
    doc.text("Bonus", 16, yPos);
    doc.text(formatCurrencyForPDF(payslip.bonus), 80, yPos, { align: "right" });
    yPos += 7;
    
    // Deductions table
    yPos = 122;
    
    doc.text("Tax", 113, yPos);
    doc.text(formatCurrencyForPDF(payslip.tax), 193, yPos, { align: "right" });
    yPos += 7;
    
    doc.text("Health Insurance", 113, yPos);
    doc.text(formatCurrencyForPDF(payslip.healthInsurance), 193, yPos, { align: "right" });
    yPos += 7;
    
    doc.text("Retirement", 113, yPos);
    doc.text(formatCurrencyForPDF(payslip.retirement), 193, yPos, { align: "right" });
    yPos += 7;
    
    // Total Earnings
    yPos = 145;
    doc.line(14, yPos - 3, 99, yPos - 3);
    doc.setFont("helvetica", "bold");
    doc.text("Gross Pay", 16, yPos);
    doc.text(formatCurrencyForPDF(payslip.grossPay), 80, yPos, { align: "right" });
    
    // Total Deductions
    doc.line(111, yPos - 3, 196, yPos - 3);
    doc.text("Total Deductions", 113, yPos);
    doc.text(formatCurrencyForPDF(payslip.totalDeductions), 193, yPos, { align: "right" });
    
    // Net Pay box
    yPos = 165;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, yPos - 7, 182, 20, "F");
    
    doc.setFontSize(12);
    doc.text("NET PAY", 16, yPos);
    doc.setFontSize(14);
    doc.text(formatCurrencyForPDF(payslip.netPay), 193, yPos, { align: "right" });
    
    // Footer
    yPos = 190;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer-generated document. No signature is required.", 105, yPos, { align: "center" });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos + 5, { align: "center" });
    
    return doc;
  };

  const handleViewPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setViewDialogOpen(true);
  };

  const handleDownloadPDF = (payslip: Payslip) => {
    const employee = findEmployee(payslip.employeeId);
    if (employee) {
      const doc = generatePayslipPDF(payslip, employee);
      doc.save(`Payslip_${employee.firstName}_${employee.lastName}_${formatDate(new Date(payslip.issueDate))}.pdf`);
    }
  };

  const renderEmployeeName = (employeeId: number) => {
    const employee = findEmployee(employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const renderEmployeeInfo = (employeeId: number) => {
    const employee = findEmployee(employeeId);
    return employee ? (
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback style={{ backgroundColor: stringToColor(employee.department) }}>
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{employee.firstName} {employee.lastName}</div>
          <div className="text-xs text-gray-500">{employee.position}</div>
        </div>
      </div>
    ) : 'Unknown Employee';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Payslips</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Link href="/create-payslip">
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Generate Payslip
            </Button>
          </Link>
        </div>
      </div>

      {/* Payslips List */}
      <div className="grid grid-cols-1 gap-6">
        {payslips.map((payslip) => (
          <Card key={payslip.id} className="hover-card-shadow bg-white">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{renderEmployeeName(payslip.employeeId)}</CardTitle>
                  <CardDescription className="mt-1.5">
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Pay Period: {formatDate(new Date(payslip.payPeriodStart))} - {formatDate(new Date(payslip.payPeriodEnd))}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {formatDate(new Date(payslip.issueDate))}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1 flex items-center">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    Employee
                  </span>
                  <div>{renderEmployeeInfo(payslip.employeeId)}</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1 flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1.5" />
                    Gross Pay
                  </span>
                  <span className="font-medium">{formatCurrency(payslip.grossPay)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1 flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1.5" />
                    Net Pay
                  </span>
                  <span className="font-semibold text-green-600">{formatCurrency(payslip.netPay)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <div className="flex justify-end gap-2 w-full">
                <Button variant="outline" size="sm" className="flex items-center" onClick={() => handleViewPayslip(payslip)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex items-center" onClick={() => handleDownloadPDF(payslip)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payslip View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedPayslip && (
            <>
              <DialogHeader>
                <DialogTitle>Payslip Details</DialogTitle>
                <DialogDescription>
                  Review the payslip information below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">Employee Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee</p>
                      <p className="font-medium">{renderEmployeeName(selectedPayslip.employeeId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{findEmployee(selectedPayslip.employeeId)?.department || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">Pay Period</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Period</p>
                      <p className="font-medium">{formatDate(new Date(selectedPayslip.payPeriodStart))} to {formatDate(new Date(selectedPayslip.payPeriodEnd))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="font-medium">{formatDate(new Date(selectedPayslip.issueDate))}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-800 mb-2">Earnings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Basic Salary</span>
                        <span className="font-medium">{formatCurrency(selectedPayslip.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overtime</span>
                        <span className="font-medium">{formatCurrency(selectedPayslip.overtime)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Bonus</span>
                        <span className="font-medium">{formatCurrency(selectedPayslip.bonus)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-sm font-semibold">Gross Pay</span>
                        <span className="font-semibold">{formatCurrency(selectedPayslip.grossPay)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-800 mb-2">Deductions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tax</span>
                        <span className="font-medium">{formatCurrency(selectedPayslip.tax)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Health Insurance</span>
                        <span className="font-medium">{formatCurrency(selectedPayslip.healthInsurance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Retirement</span>
                        <span className="font-medium">{formatCurrency(selectedPayslip.retirement)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-sm font-semibold">Total Deductions</span>
                        <span className="font-semibold">{formatCurrency(selectedPayslip.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary-700">Net Pay</span>
                    <span className="font-bold text-xl text-primary-700">{formatCurrency(selectedPayslip.netPay)}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleDownloadPDF(selectedPayslip)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}