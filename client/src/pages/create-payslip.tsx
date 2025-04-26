import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Home, 
  ChevronLeft, 
  Calculator, 
  CreditCard, 
  CalendarRange,
  IndianRupee,
  Clock,
  Plus,
  Percent
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Define payslip form schema
const payslipFormSchema = z.object({
  employeeId: z.string().min(1, { message: "Please select an employee" }),
  payPeriodStart: z.string().min(1, { message: "Start date is required" }),
  payPeriodEnd: z.string().min(1, { message: "End date is required" }),
  basicSalary: z.string().min(1, { message: "Basic salary is required" }),
  overtime: z.string().optional(),
  bonus: z.string().optional(),
  tax: z.string().optional(),
  healthInsurance: z.string().optional(),
  retirement: z.string().optional(),
});

type PayslipFormValues = z.infer<typeof payslipFormSchema>;

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joiningDate: string;
  employeeId: string;
  basicSalary: number;
  status: string;
};

export default function CreatePayslip() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const [grossPay, setGrossPay] = useState<number>(0);
  const [totalDeductions, setTotalDeductions] = useState<number>(0);
  const [netPay, setNetPay] = useState<number>(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  
  // Initialize form
  const form = useForm<PayslipFormValues>({
    resolver: zodResolver(payslipFormSchema),
    defaultValues: {
      employeeId: "",
      payPeriodStart: format(new Date(), "yyyy-MM-dd"),
      payPeriodEnd: format(new Date(new Date().setDate(new Date().getDate() + 30)), "yyyy-MM-dd"),
      basicSalary: "",
      overtime: "0",
      bonus: "0",
      tax: "0",
      healthInsurance: "0",
      retirement: "0",
    },
  });

  // Fetch employees
  const { data: employees = [] } = useQuery({
    queryKey: ['/api/employees'],
  });

  // Calculate values whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      calculateValues();
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const generatePayslipMutation = useMutation({
    mutationFn: async (data: any) => {
      return fetch('/api/payslips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to generate payslip');
        }
        return res.json();
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payslip has been generated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payslips'] });
      navigate("/payslips");
    },
    onError: (error) => {
      console.error('Payslip generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate payslip. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateValues = () => {
    const basicSalary = parseFloat(form.getValues().basicSalary) || 0;
    const overtime = parseFloat(form.getValues().overtime || "0") || 0;
    const bonus = parseFloat(form.getValues().bonus || "0") || 0;
    const tax = parseFloat(form.getValues().tax || "0") || 0;
    const healthInsurance = parseFloat(form.getValues().healthInsurance || "0") || 0;
    const retirement = parseFloat(form.getValues().retirement || "0") || 0;
    
    const gross = basicSalary + overtime + bonus;
    const deductions = tax + healthInsurance + retirement;
    const net = gross - deductions;
    
    setGrossPay(gross);
    setTotalDeductions(deductions);
    setNetPay(net);
  };

  const onSubmit = (data: PayslipFormValues) => {
    calculateValues();
    
    const payPeriodStartDate = new Date(data.payPeriodStart);
    const payPeriodEndDate = new Date(data.payPeriodEnd);
    const issueDateObj = new Date();
    
    generatePayslipMutation.mutate({
      employeeId: parseInt(data.employeeId),
      payPeriodStart: payPeriodStartDate,
      payPeriodEnd: payPeriodEndDate,
      issueDate: issueDateObj,
      basicSalary: parseFloat(data.basicSalary),
      overtime: parseFloat(data.overtime || "0"),
      bonus: parseFloat(data.bonus || "0"),
      tax: parseFloat(data.tax || "0"),
      healthInsurance: parseFloat(data.healthInsurance || "0"),
      retirement: parseFloat(data.retirement || "0"),
      grossPay,
      totalDeductions,
      netPay,
    });
  };

  const handlePreview = () => {
    calculateValues();
    setIsPreviewModalOpen(true);
  };

  const selectedEmployee = employees.find(
    (employee: Employee) => employee.id === parseInt(form.getValues().employeeId)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Generate Payslip</h1>
        <Link href="/payslips">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Payslips
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payslip Information</CardTitle>
          <CardDescription>
            Fill in the details to generate a new payslip for an employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee: Employee) => (
                              <SelectItem 
                                key={employee.id} 
                                value={employee.id.toString()}
                              >
                                {employee.firstName} {employee.lastName} - {employee.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="payPeriodStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pay Period Start</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="payPeriodEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pay Period End</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="basicSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Salary</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input type="number" placeholder="0.00" className="pl-10" {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                if (selectedEmployee && !form.getValues().basicSalary) {
                                  form.setValue("basicSalary", selectedEmployee.basicSalary.toString());
                                }
                              }} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="overtime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overtime</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                              <Input type="number" placeholder="0.00" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bonus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bonus</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Plus className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                              <Input type="number" placeholder="0.00" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  <h3 className="text-md font-medium mb-2">Deductions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                              <Input type="number" placeholder="0.00" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="healthInsurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Insurance</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                              <Input type="number" placeholder="0.00" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="retirement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retirement</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input type="number" placeholder="0.00" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Gross Pay</h3>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(grossPay)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Deductions</h3>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Net Pay</h3>
                  <p className="text-xl font-bold">{formatCurrency(netPay)}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={!form.getValues().employeeId}
                >
                  Preview
                </Button>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting || !form.getValues().employeeId}
                >
                  Generate Payslip
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
            <DialogDescription>
              Review the payslip details before generating
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Employee Information</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span> {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </div>
                  <div>
                    <span className="text-gray-500">ID:</span> {selectedEmployee.employeeId}
                  </div>
                  <div>
                    <span className="text-gray-500">Position:</span> {selectedEmployee.position}
                  </div>
                  <div>
                    <span className="text-gray-500">Department:</span> {selectedEmployee.department}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Pay Period</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">From:</span> {form.getValues().payPeriodStart}
                  </div>
                  <div>
                    <span className="text-gray-500">To:</span> {form.getValues().payPeriodEnd}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Earnings</h3>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="flex justify-between border-b py-1">
                    <span>Basic Salary</span>
                    <span>{formatCurrency(parseFloat(form.getValues().basicSalary))}</span>
                  </div>
                  <div className="flex justify-between border-b py-1">
                    <span>Overtime</span>
                    <span>{formatCurrency(parseFloat(form.getValues().overtime || "0"))}</span>
                  </div>
                  <div className="flex justify-between border-b py-1">
                    <span>Bonus</span>
                    <span>{formatCurrency(parseFloat(form.getValues().bonus || "0"))}</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span>Gross Pay</span>
                    <span>{formatCurrency(grossPay)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Deductions</h3>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="flex justify-between border-b py-1">
                    <span>Tax</span>
                    <span>{formatCurrency(parseFloat(form.getValues().tax || "0"))}</span>
                  </div>
                  <div className="flex justify-between border-b py-1">
                    <span>Health Insurance</span>
                    <span>{formatCurrency(parseFloat(form.getValues().healthInsurance || "0"))}</span>
                  </div>
                  <div className="flex justify-between border-b py-1">
                    <span>Retirement</span>
                    <span>{formatCurrency(parseFloat(form.getValues().retirement || "0"))}</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span>Total Deductions</span>
                    <span>{formatCurrency(totalDeductions)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Pay</span>
                  <span>{formatCurrency(netPay)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPreviewModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsPreviewModalOpen(false);
                form.handleSubmit(onSubmit)();
              }}
            >
              Generate Payslip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}