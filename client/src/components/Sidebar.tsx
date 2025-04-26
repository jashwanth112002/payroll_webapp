import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  PlusSquare,
  ClipboardList,
  Settings,
  Clock,
  Archive,
  BarChart4,
  UserCircle
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const [location] = useLocation();

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  // Custom navigation item component to ensure all links have same behavior
  const NavItem = ({ href, icon, label, isActive }: { 
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
  }) => (
    <Link
      href={href}
      onClick={closeSidebarOnMobile}
    >
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer",
        isActive && "bg-primary-50 text-primary-700 font-medium"
      )}>
        {icon}
        {label}
      </div>
    </Link>
  );

  return (
    <div className="h-full w-full py-8 px-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <BarChart4 className="h-8 w-8 text-primary-600" />
        <span className="text-2xl font-bold text-gradient">PayMeet</span>
      </div>

      <div className="space-y-1 mb-8">
        <NavItem 
          href="/" 
          icon={<LayoutDashboard className="h-5 w-5 text-gray-500" />} 
          label="Dashboard" 
          isActive={location === "/"} 
        />
        <NavItem 
          href="/employees" 
          icon={<Users className="h-5 w-5 text-gray-500" />} 
          label="Employees" 
          isActive={location === "/employees"} 
        />
        <NavItem 
          href="/payslips" 
          icon={<FileText className="h-5 w-5 text-gray-500" />} 
          label="Payslips" 
          isActive={location === "/payslips"} 
        />
        <NavItem 
          href="/meetings" 
          icon={<Calendar className="h-5 w-5 text-gray-500" />} 
          label="Meetings" 
          isActive={location === "/meetings"} 
        />
        <NavItem 
          href="/profile" 
          icon={<UserCircle className="h-5 w-5 text-gray-500" />} 
          label="My Profile" 
          isActive={location === "/profile"} 
        />
      </div>

      <div className="mb-8">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payroll</h3>
        <div className="space-y-1">
          <NavItem 
            href="/create-payslip" 
            icon={<PlusSquare className="h-5 w-5 text-gray-500" />} 
            label="Generate Payslip" 
            isActive={location === "/create-payslip"} 
          />
          
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-5 w-5 text-gray-500" />} 
            label="Settings" 
            isActive={location === "/settings"} 
          />
        </div>
      </div>

      <div>
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Meetings</h3>
        <div className="space-y-1">
          <NavItem 
            href="/create-meeting" 
            icon={<PlusSquare className="h-5 w-5 text-gray-500" />} 
            label="Schedule Meeting" 
            isActive={location === "/create-meeting"} 
          />
          <NavItem 
            href="/meetings" 
            icon={<Clock className="h-5 w-5 text-gray-500" />} 
            label="Upcoming Meetings" 
            isActive={false} 
          />
          <NavItem 
            href="/meetings" 
            icon={<ClipboardList className="h-5 w-5 text-gray-500" />} 
            label="Meeting History" 
            isActive={false} 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
