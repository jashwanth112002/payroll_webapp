import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Calendar,
  Clock,
  MapPin, 
  Users,
  Edit,
  Trash,
  Filter,
  Search
} from "lucide-react";
import { Link } from "wouter";
import { format } from 'date-fns';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { apiRequest, queryClient } from "../lib/queryClient";
import { formatDate, stringToColor } from "../lib/utils";
import { useToast } from "../hooks/use-toast";

type Meeting = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
};

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
};

type MeetingParticipant = {
  meetingId: number;
  employeeId: number;
};

export default function Meetings() {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');

  const { data: meetings = [] } = useQuery<Meeting[]>({
    queryKey: ['/api/meetings'],
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const { data: participants = [] } = useQuery<MeetingParticipant[]>({
    queryKey: ['/api/meeting-participants'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/meetings/${id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
      toast({
        title: 'Success',
        description: 'Meeting deleted successfully',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete meeting',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: number) => {
    setMeetingToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (meetingToDelete !== null) {
      deleteMutation.mutate(meetingToDelete);
    }
  };

  // Filter and sort meetings based on search query and filter status
  const filteredMeetings = meetings
    .filter(meeting => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          meeting.title.toLowerCase().includes(query) ||
          meeting.location.toLowerCase().includes(query) ||
          meeting.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(meeting => {
      // Status filter
      const meetingDate = new Date(meeting.date);
      const today = new Date();
      
      if (filterStatus === 'upcoming') {
        return meetingDate >= today;
      } else if (filterStatus === 'past') {
        return meetingDate < today;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Get participants for a meeting
  const getMeetingParticipants = (meetingId: number) => {
    const meetingParticipants = participants
      .filter(p => p.meetingId === meetingId)
      .map(p => p.employeeId);
    
    return employees.filter(employee => meetingParticipants.includes(employee.id));
  };

  // Check if the meeting is today, upcoming, or past
  const getMeetingStatus = (dateStr: string) => {
    const meetingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (meetingDate.getTime() === today.getTime()) {
      return { label: 'Today', className: 'bg-amber-100 text-amber-800 border-amber-200' };
    } else if (meetingDate > today) {
      return { label: 'Upcoming', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    } else {
      return { label: 'Past', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  // Format time to display in 12-hour format
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return 'N/A';
    
    // Handle case where time might be in a format like "10:00 - 11:00"
    if (timeStr.includes(' - ')) {
      return timeStr; // If it's already formatted with a range, return it as is
    }
    
    try {
      const [hours, minutes] = timeStr.split(':');
      if (!hours || !minutes) return timeStr;
      
      const hour = parseInt(hours, 10);
      if (isNaN(hour)) return timeStr;
      
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeStr; // Return original string if there's an error
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'past')}
          >
            <option value="all">All Meetings</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <Link href="/create-meeting">
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Schedule Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredMeetings.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Calendar className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-600">No meetings found</h3>
              <p className="text-gray-500 mt-2">
                {searchQuery ? 'No meetings match your search.' : 'Schedule a meeting to get started.'}
              </p>
              {!searchQuery && (
                <Link href="/create-meeting">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-1" />
                    Schedule Meeting
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredMeetings.map((meeting) => {
            const status = getMeetingStatus(meeting.date);
            const participants = getMeetingParticipants(meeting.id);
            
            return (
              <Card key={meeting.id} className="hover-card-shadow bg-white">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <CardDescription className="mt-1.5">
                        <span className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {formatDate(new Date(meeting.date))}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Time
                      </span>
                      <span className="font-medium">
                        {meeting.time ? meeting.time : `${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}`}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        Location
                      </span>
                      <span className="font-medium">{meeting.location}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1 flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1.5" />
                        Participants
                      </span>
                      <div className="flex -space-x-2 overflow-hidden">
                        {participants.slice(0, 5).map((participant) => (
                          <Avatar key={participant.id} className="h-7 w-7 border-2 border-white">
                            <AvatarFallback style={{ backgroundColor: stringToColor(participant.firstName) }}>
                              {participant.firstName.charAt(0)}{participant.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {participants.length > 5 && (
                          <div className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-700">
                            +{participants.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {meeting.description && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-500 mb-1">Description</span>
                      <p className="text-sm text-gray-700">{meeting.description}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-3">
                  <div className="flex justify-end gap-2 w-full">
                    <Link href={`/edit-meeting/${meeting.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex items-center text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(meeting.id)}>
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meeting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}