import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
} | undefined;

interface PayslipPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslip: Payslip;
  employee: Employee;
  onDownload: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const PayslipPreviewModal: React.FC<PayslipPreviewModalProps> = ({
  open,
  onOpenChange,
  payslip,
  employee,
  onDownload
}) => {
  const handlePrint = () => {
    window.print();
  };

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Payslip Preview</DialogTitle>
        </DialogHeader>

        <div className="bg-white p-6 rounded-lg border border-gray-200 print:border-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary-600 mb-1">PayMeet Inc.</h1>
              <p className="text-sm text-gray-600">123 Business Avenue</p>
              <p className="text-sm text-gray-600">New York, NY 10001</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold">PAYSLIP</h2>
              <p className="text-sm text-gray-600">Pay Period: {formatDate(payslip.payPeriodStart)} - {formatDate(payslip.payPeriodEnd)}</p>
              <p className="text-sm text-gray-600">Payment Date: {formatDate(payslip.issueDate)}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Employee Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Employee Information</h3>
              <p className="text-sm mb-1"><span className="font-medium">Name:</span> {employee.firstName} {employee.lastName}</p>
              <p className="text-sm mb-1"><span className="font-medium">Employee ID:</span> {employee.employeeId}</p>
              <p className="text-sm mb-1"><span className="font-medium">Department:</span> {employee.department}</p>
              <p className="text-sm mb-1"><span className="font-medium">Position:</span> {employee.position}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Payment Information</h3>
              <p className="text-sm mb-1"><span className="font-medium">Payment Method:</span> Direct Deposit</p>
              <p className="text-sm mb-1"><span className="font-medium">Bank:</span> National Bank</p>
              <p className="text-sm mb-1"><span className="font-medium">Account:</span> XXXX-XXXX-1234</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Earnings and Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Earnings</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2">Basic Salary</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.basicSalary)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Overtime</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.overtime)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Bonus</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.bonus)}</td>
                  </tr>
                  <tr className="font-medium">
                    <td className="px-4 py-2">Total Earnings</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.grossPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Deductions</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2">Income Tax</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.tax)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Health Insurance</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.healthInsurance)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Retirement Plan</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.retirement)}</td>
                  </tr>
                  <tr className="font-medium">
                    <td className="px-4 py-2">Total Deductions</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(payslip.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center mb-6">
            <span className="font-semibold text-gray-700">Net Pay:</span>
            <span className="text-lg font-bold text-primary-700">{formatCurrency(payslip.netPay)}</span>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>For questions regarding this payslip, please contact HR department at hr@paymeet.com</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipPreviewModal;
