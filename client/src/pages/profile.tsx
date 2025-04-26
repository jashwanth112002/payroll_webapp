import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase,
  Upload,
  Save
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
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { stringToColor } from "../lib/utils";

// Define the form schema
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  photoUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Form values
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    photoUrl: "",
  });

  // Form errors
  const [formErrors, setFormErrors] = useState<{
    [key in keyof ProfileFormValues]?: string;
  }>({});

  // Fetch profile data
  const { data: profile, isLoading } = useQuery<ProfileFormValues>({
    queryKey: ['/api/profile'],
  });

  // Update form when profile data is fetched
  useEffect(() => {
    if (profile) {
      setFormValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        department: profile.department || "",
        position: profile.position || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zipCode || "",
        country: profile.country || "",
        photoUrl: profile.photoUrl || "",
      });
      
      if (profile.photoUrl) {
        setPreviewUrl(profile.photoUrl);
      }
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return apiRequest('PATCH', '/api/profile', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Get the profile ID from the current profile data
      // Safely access id property or default to 1
      const profileId = profile && 'id' in profile ? (profile as any).id : 1;
      
      console.log("Uploading photo for profile ID:", profileId);
      
      const response = await fetch(`/api/profile/${profileId}/photo`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        console.error("Upload failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error('Failed to upload photo');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Photo upload success, data:", data);
      // Force refresh the preview with a timestamp to avoid caching
      const photoUrlWithTimestamp = `${data.photoUrl}?t=${Date.now()}`;
      
      setPreviewUrl(photoUrlWithTimestamp);
      setFormValues(prev => ({
        ...prev,
        photoUrl: data.photoUrl
      }));
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    },
    onError: (error) => {
      console.error("Photo upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof ProfileFormValues]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('photo', file);
      uploadPhotoMutation.mutate(formData);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    try {
      const validated = profileFormSchema.parse(formValues);
      updateProfileMutation.mutate(validated);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>
              Manage your personal information and photo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="Profile photo" />
                  ) : (
                    <AvatarFallback 
                      style={{ 
                        backgroundColor: stringToColor(formValues.firstName + formValues.lastName) 
                      }}
                    >
                      {formValues.firstName.charAt(0)}{formValues.lastName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Profile Photo</h3>
                <p className="text-sm text-gray-500">
                  Click the button to upload a new photo
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleUploadClick}
                >
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={formValues.firstName}
                    onChange={handleInputChange}
                    placeholder="Your first name"
                    className={`pl-10 ${formErrors.firstName ? "border-red-400" : ""}`}
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={formValues.lastName}
                    onChange={handleInputChange}
                    placeholder="Your last name"
                    className={`pl-10 ${formErrors.lastName ? "border-red-400" : ""}`}
                  />
                </div>
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    placeholder="Your email address"
                    className={`pl-10 ${formErrors.email ? "border-red-400" : ""}`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formValues.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Work Information</CardTitle>
            <CardDescription>
              Your position and department information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="department" 
                    name="department" 
                    value={formValues.department || ""}
                    onChange={handleInputChange}
                    placeholder="Your department"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="position" 
                    name="position" 
                    value={formValues.position || ""}
                    onChange={handleInputChange}
                    placeholder="Your position"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Address Information</CardTitle>
            <CardDescription>
              Your address and location details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  id="address" 
                  name="address" 
                  value={formValues.address || ""}
                  onChange={handleInputChange}
                  placeholder="Your street address"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formValues.city || ""}
                  onChange={handleInputChange}
                  placeholder="Your city"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input 
                  id="state" 
                  name="state" 
                  value={formValues.state || ""}
                  onChange={handleInputChange}
                  placeholder="Your state/province"
                />
              </div>

              {/* Zip Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip / Postal Code</Label>
                <Input 
                  id="zipCode" 
                  name="zipCode" 
                  value={formValues.zipCode || ""}
                  onChange={handleInputChange}
                  placeholder="Your zip/postal code"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                name="country" 
                value={formValues.country || ""}
                onChange={handleInputChange}
                placeholder="Your country"
              />
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex gap-2 justify-end px-0">
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}