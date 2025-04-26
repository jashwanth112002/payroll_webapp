import React, { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import * as z from "zod";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Info, 
  ChevronLeft,
  X,
  Check
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { formatDate, stringToColor } from "../lib/utils";

// Define the form schema
const meetingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  participants: z.array(z.number()).min(1, "At least one participant is required")
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
};

export default function CreateMeeting() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Form values
  const [formValues, setFormValues] = useState<MeetingFormValues>({
    title: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    description: "",
    participants: []
  });

  // Form errors
  const [formErrors, setFormErrors] = useState<{
    [key in keyof MeetingFormValues]?: string;
  }>({});

  // Selected participants for display
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  // Fetch employees data
  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  // Create meeting mutation
  const createMeetingMutation = useMutation({
    mutationFn: async (data: MeetingFormValues) => {
      return fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to schedule meeting');
        }
        return res.json();
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
      navigate("/meetings");
    },
    onError: (error) => {
      console.error('Meeting creation error:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof MeetingFormValues]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof MeetingFormValues]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle participant selection
  const handleParticipantSelection = (employeeId: number) => {
    setSelectedParticipants((prev) => {
      const isSelected = prev.includes(employeeId);
      
      if (isSelected) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });

    setFormValues((prev) => {
      const currentParticipants = prev.participants || [];
      const isSelected = currentParticipants.includes(employeeId);
      
      let newParticipants;
      if (isSelected) {
        newParticipants = currentParticipants.filter(id => id !== employeeId);
      } else {
        newParticipants = [...currentParticipants, employeeId];
      }
      
      return {
        ...prev,
        participants: newParticipants,
      };
    });

    // Clear error when user selects a participant
    if (formErrors.participants) {
      setFormErrors((prev) => ({
        ...prev,
        participants: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    try {
      const validated = meetingFormSchema.parse(formValues);
      createMeetingMutation.mutate(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and set form errors
        const errors: {[key: string]: string} = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/meetings")}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Schedule Meeting</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Meeting Details</CardTitle>
            <CardDescription>
              Fill in the details of the meeting you want to schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meeting Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                name="title" 
                value={formValues.title}
                onChange={handleInputChange}
                placeholder="Enter meeting title"
                className={formErrors.title ? "border-red-400" : ""}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    value={formValues.date}
                    onChange={handleInputChange}
                    className={`pl-10 ${formErrors.date ? "border-red-400" : ""}`}
                  />
                </div>
                {formErrors.date && (
                  <p className="text-sm text-red-500">{formErrors.date}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="startTime" 
                    name="startTime" 
                    type="time" 
                    value={formValues.startTime}
                    onChange={handleInputChange}
                    className={`pl-10 ${formErrors.startTime ? "border-red-400" : ""}`}
                  />
                </div>
                {formErrors.startTime && (
                  <p className="text-sm text-red-500">{formErrors.startTime}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="endTime" 
                    name="endTime" 
                    type="time" 
                    value={formValues.endTime}
                    onChange={handleInputChange}
                    className={`pl-10 ${formErrors.endTime ? "border-red-400" : ""}`}
                  />
                </div>
                {formErrors.endTime && (
                  <p className="text-sm text-red-500">{formErrors.endTime}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  id="location" 
                  name="location" 
                  value={formValues.location}
                  onChange={handleInputChange}
                  placeholder="Meeting room, video conference link, etc."
                  className={`pl-10 ${formErrors.location ? "border-red-400" : ""}`}
                />
              </div>
              {formErrors.location && (
                <p className="text-sm text-red-500">{formErrors.location}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="relative">
                <Info className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formValues.description}
                  onChange={handleInputChange}
                  placeholder="Enter meeting agenda, notes, or other details"
                  className="min-h-20 pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Meeting Participants</CardTitle>
            <CardDescription>
              Select employees who should attend this meeting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Participants Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Participants <span className="text-red-500">*</span></Label>
                <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                  {selectedParticipants.length} selected
                </Badge>
              </div>
              
              {formErrors.participants && (
                <p className="text-sm text-red-500">{formErrors.participants}</p>
              )}
              
              <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedParticipants.includes(employee.id) ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => handleParticipantSelection(employee.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback style={{ backgroundColor: stringToColor(employee.department) }}>
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                        <div className="text-xs text-gray-500">{employee.position}, {employee.department}</div>
                      </div>
                    </div>
                    <div className="h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center">
                      {selectedParticipants.includes(employee.id) ? (
                        <Check className="h-4 w-4 text-primary-600" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Participants Preview */}
            {selectedParticipants.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Participants</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedParticipants.map((participantId) => {
                    const employee = employees.find(e => e.id === participantId);
                    if (!employee) return null;
                    
                    return (
                      <Badge 
                        key={employee.id} 
                        variant="outline" 
                        className="pl-2 pr-1 py-1.5 flex items-center gap-1 bg-gray-50"
                      >
                        <span>
                          {employee.firstName} {employee.lastName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParticipantSelection(employee.id);
                          }}
                        >
                          <X className="h-2.5 w-2.5" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <CardFooter className="flex gap-2 justify-end px-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/meetings")}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createMeetingMutation.isPending}
          >
            {createMeetingMutation.isPending ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}