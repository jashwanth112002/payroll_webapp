import React, { useState, useRef, useEffect } from "react";
import { Bell, User, Upload } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { stringToColor } from "../lib/utils";
import { useToast } from "../hooks/use-toast";

interface NavbarProps {
  toggleSidebar: () => void;
}

type Profile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
};

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  // Fetch user profile data 
  const { data: profile } = useQuery<Profile>({
    queryKey: ['/api/profile'],
  });
  
  // Update state when profile data changes
  useEffect(() => {
    if (profile && profile.photoUrl) {
      setPhotoUrl(profile.photoUrl);
    }
  }, [profile]);

  // Handle click on photo to upload new one
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a FormData object
      const formData = new FormData();
      formData.append('photo', file);

      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.photoUrl) {
            toast({
              title: "Success",
              description: "Profile photo updated successfully",
            });
          }
        })
        .catch(error => {
          toast({
            title: "Error",
            description: "Failed to upload photo. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="navbar bg-white shadow-sm sticky top-0 z-30 no-print">
      <div className="flex-none lg:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          id="hamburger-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </Button>
      </div>
      <div className="flex-1">
        <span className="text-xl font-bold ml-2 text-gradient">PayMeet</span>
      </div>
      <div className="flex-none gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <span>Payslips generated for April</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <span>Meeting with HR at 2PM</span>
                  <span className="text-xs text-muted-foreground">3 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <span>New employee added</span>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center" asChild>
              <Link href="/notifications">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full group" size="icon">
              <div className="relative">
                <Avatar className="cursor-pointer">
                  {photoUrl ? (
                    <AvatarImage src={photoUrl} alt="Profile" />
                  ) : (
                    <AvatarFallback 
                      style={{ 
                        backgroundColor: profile ? stringToColor(profile.firstName + profile.lastName) : 'gray' 
                      }}
                    >
                      {profile ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-40">
                  <Upload className="h-4 w-4 text-white" />
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePhotoClick}>
              Change Photo
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
