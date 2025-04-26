import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  BarChart4, 
  Users, 
  FileText, 
  Calendar, 
  Download, 
  Filter, 
  Plus, 
  Eye, 
  Clock, 
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCard from "@/components/StatsCard";
import { formatCurrency } from "@/lib/utils";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  status: 'active' | 'on-leave' | 'inactive';
};

type Payslip = {
  id: number;
  employeeId: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  issueDate: string;
  netPay: number;
};

type Meeting = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number[];
  status: 'upcoming' | 'today' | 'completed';
};

const Dashboard = () => {
  const { data: payslips = [] } = useQuery<Payslip[]>({
    queryKey: ['/api/payslips/recent'],
  });
  
  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });
  
  const { data: meetings = [] } = useQuery<Meeting[]>({
    queryKey: ['/api/meetings/upcoming'],
  });
  
  const { data: payrollStats = { totalSalary: 0, overtime: 0, bonuses: 0, taxDeductions: 0, insuranceBenefits: 0, netPayroll: 0 } } = useQuery({
    queryKey: ['/api/payroll/stats'],
  });

  const { data: employeeStats = { active: 0, onLeave: 0, inactive: 0, total: 0 } } = useQuery({
    queryKey: ['/api/employees/stats'],
  });

  const getEmployeeById = (id: number) => {
    return employees.find(emp => emp.id === id) || { firstName: '', lastName: '', department: '' };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-amber-100 text-amber-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingBadgeClass = (status: string) => {
    switch(status) {
      case 'today': return 'bg-primary-100 text-primary-800';
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorByDepartment = (department: string) => {
    const depts = {
      'Development': 'bg-primary-100 text-primary-700',
      'Marketing': 'bg-secondary-100 text-secondary-700',
      'Finance': 'bg-accent-100 text-accent-700',
      'Human Resources': 'bg-green-100 text-green-700'
    };
    return depts[department as keyof typeof depts] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Link href="/create-payslip">
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              New Payslip
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={employeeStats.total}
          description="8% from last month"
          trend="up"
          icon={<Users className="h-6 w-6 text-primary-600" />}
          className="bg-white"
        />
        
        <StatsCard
          title="Payslips Generated"
          value={payslips.length}
          description="12% from last month"
          trend="up"
          icon={<FileText className="h-6 w-6 text-secondary-600" />}
          className="bg-white"
        />
        
        <StatsCard
          title="Upcoming Meetings"
          value={meetings.length}
          description="3% from last week"
          trend="down"
          icon={<Calendar className="h-6 w-6 text-accent-600" />}
          className="bg-white"
        />
        
        <StatsCard
          title="Monthly Payroll"
          value={formatCurrency(payrollStats.netPayroll)}
          description="5% from last month"
          trend="up"
          icon={<BarChart4 className="h-6 w-6 text-green-600" />}
          className="bg-white"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payslips */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-gray-800">Recent Payslips</h2>
                <Link href="/payslips" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payslips.slice(0, 4).map((payslip) => {
                      const employee = getEmployeeById(payslip.employeeId);
                      return (
                        <tr key={payslip.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className={getColorByDepartment(employee.department)}>
                                  {getInitials(employee.firstName, employee.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{`${employee.firstName} ${employee.lastName}`}</div>
                                <div className="text-xs text-gray-500">{employee.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {new Date(payslip.payPeriodStart).toLocaleDateString()} - {new Date(payslip.payPeriodEnd).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {new Date(payslip.issueDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(payslip.netPay)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary-600 hover:bg-primary-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary-600 hover:bg-primary-50">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <div className="col-span-1">
          <Card className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-gray-800">Upcoming Meetings</h2>
                <Link href="/meetings" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {meetings.slice(0, 3).map((meeting) => (
                  <div key={meeting.id} className="p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${getMeetingBadgeClass(meeting.status)}`}>
                        {meeting.status === 'today' ? 'Today' : new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(meeting.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {meeting.time}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {meeting.location}
                    </div>
                    <div className="flex items-center mt-3">
                      <div className="flex -space-x-2">
                        {meeting.participants.slice(0, 4).map((participantId, idx) => {
                          const emp = getEmployeeById(participantId);
                          return (
                            <Avatar key={idx} className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className={getColorByDepartment(emp.department)}>
                                {getInitials(emp.firstName, emp.lastName)}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {meeting.participants.length > 4 && (
                          <Avatar className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                              +{meeting.participants.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{meeting.participants.length} participants</span>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-center">
                  <Link href="/create-meeting">
                    <Button variant="link" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                      Schedule New Meeting
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Status */}
        <Card className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-800">Employee Status</h2>
              <Link href="/employees" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-700">{employeeStats.active}</div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">{employeeStats.onLeave}</div>
                  <div className="text-sm text-amber-600">On Leave</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-700">{employeeStats.inactive}</div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Recent Status Changes</h3>
                <ul className="space-y-3">
                  {employees.slice(0, 3).map((employee) => (
                    <li key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={getColorByDepartment(employee.department)}>
                            {getInitials(employee.firstName, employee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{`${employee.firstName} ${employee.lastName}`}</div>
                          <div className="text-xs text-gray-500">{employee.department}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(employee.status)}`}>
                        {employee.status === 'on-leave' ? 'On Leave' : employee.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Payroll Overview */}
        <Card className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-800">Payroll Overview</h2>
              <div className="flex items-center space-x-2">
                <Select defaultValue="april">
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="april">April 2025</SelectItem>
                    <SelectItem value="march">March 2025</SelectItem>
                    <SelectItem value="february">February 2025</SelectItem>
                    <SelectItem value="january">January 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-gray-600 text-sm">Total Salary</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(payrollStats.totalSalary)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-600 text-sm">Overtime Pay</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(payrollStats.overtime)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-600 text-sm">Bonuses</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(payrollStats.bonuses)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-600 text-sm">Tax Deductions</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(payrollStats.taxDeductions)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-600 text-sm">Insurance & Benefits</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(payrollStats.insuranceBenefits)}</div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-primary-700 font-semibold">Net Payroll</div>
                  <div className="text-xl font-bold text-primary-700">{formatCurrency(payrollStats.netPayroll)}</div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-blue-700 font-medium">Next payroll processing: April, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
