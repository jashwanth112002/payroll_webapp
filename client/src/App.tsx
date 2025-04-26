import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/dashboard";
import Payslips from "@/pages/payslips";
import Profile from "@/pages/profile";
import Employees from "@/pages/employees";
import Meetings from "@/pages/meetings";
import CreateMeeting from "@/pages/create-meeting";
import CreatePayslip from "@/pages/create-payslip";
import Settings from "@/pages/settings";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, Calendar, FileText, Clock, Users } from "lucide-react";

// Dummy components for reference
const CreateMeetingDummy = () => (
  <div className="p-8">
    <div className="flex items-center gap-2 mb-8">
      <Link href="/meetings">
        <Button variant="ghost" size="sm" className="gap-1">
          <ChevronLeft size={16} />
          Back to Meetings
        </Button>
      </Link>
      <h1 className="text-2xl font-bold">Schedule New Meeting</h1>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Meeting Title</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="Enter meeting title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input 
              type="time" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input 
              type="time" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="Meeting location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Participants</label>
            <select 
              multiple 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 h-24" 
            >
              <option>Jashwanth (HR)</option>
              <option>Anand (Marketing)</option>
              <option>Rakesh (IT)</option>
              <option>Rinkesh (Finance)</option>
              <option>Sangamesh (Sales)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 h-32"
            placeholder="Meeting description and agenda..."
          ></textarea>
        </div>
        
        <div className="flex justify-end gap-2">
          <Link href="/meetings">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Dummy CreatePayslip component
const CreatePayslipDummy = () => (
  <div className="p-8">
    <div className="flex items-center gap-2 mb-8">
      <Link href="/payslips">
        <Button variant="ghost" size="sm" className="gap-1">
          <ChevronLeft size={16} />
          Back to Payslips
        </Button>
      </Link>
      <h1 className="text-2xl font-bold">Generate New Payslip</h1>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            >
              <option value="">Select Employee</option>
              <option>Jashwanth (HR)</option>
              <option>Anand (Marketing)</option>
              <option>Rakesh (IT)</option>
              <option>Rinkesh (Finance)</option>
              <option>Sangamesh(Sales)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Pay Period Start</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Pay Period End</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Issue Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Basic Salary</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Overtime</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Bonus</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tax</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Health Insurance</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Retirement</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Link href="/payslips">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Payslip
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Dummy Employees component
const EmployeesDummy = () => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Employees</h1>
      <Button>
        <Users className="h-4 w-4 mr-2" />
        Add New Employee
      </Button>
    </div>

    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">JD</div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">John Doe</div>
                    <div className="text-sm text-gray-500">#EMP001</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HR Manager</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Human Resources</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john.doe@example.com</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">JS</div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                    <div className="text-sm text-gray-500">#EMP002</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marketing Specialist</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marketing</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jane.smith@example.com</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">On Leave</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">2</span> of <span className="font-medium">2</span> results
        </div>
        <div className="flex-1 flex justify-end">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled className="ml-2">Next</Button>
        </div>
      </div>
    </div>
  </div>
);

// Dummy Meetings component
const MeetingsDummy = () => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Meetings</h1>
      <Link href="/create-meeting">
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </Link>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Upcoming Meetings</h2>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">Project Kickoff Meeting</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Today</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>10:00 AM - 11:30 AM</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>5 Participants</span>
                  </div>
                </div>
                <div className="mt-3 flex">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="ghost" size="sm" className="ml-2 text-red-500">Cancel</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">Weekly Team Standup</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">Tomorrow</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>9:00 AM - 9:30 AM</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>8 Participants</span>
                  </div>
                </div>
                <div className="mt-3 flex">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="ghost" size="sm" className="ml-2 text-red-500">Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Calendar</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              <div className="text-xs font-medium text-gray-500">Sun</div>
              <div className="text-xs font-medium text-gray-500">Mon</div>
              <div className="text-xs font-medium text-gray-500">Tue</div>
              <div className="text-xs font-medium text-gray-500">Wed</div>
              <div className="text-xs font-medium text-gray-500">Thu</div>
              <div className="text-xs font-medium text-gray-500">Fri</div>
              <div className="text-xs font-medium text-gray-500">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i} 
                  className={`
                    py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100
                    ${i === 8 ? 'bg-primary text-white hover:bg-primary-600' : ''}
                    ${i === 9 ? 'font-medium border border-purple-300' : ''}
                  `}
                >
                  {i + 1}
                  {i === 8 && <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>}
                  {i === 9 && <div className="w-1 h-1 bg-purple-500 rounded-full mx-auto mt-1"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Loading component
const Loading = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function Router() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/payslips" component={Payslips} />
        <Route path="/profile" component={Profile} />
        <Route path="/employees" component={Employees} />
        <Route path="/meetings" component={Meetings} />
        <Route path="/create-meeting" component={CreateMeeting} />
        <Route path="/create-payslip" component={CreatePayslip} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
