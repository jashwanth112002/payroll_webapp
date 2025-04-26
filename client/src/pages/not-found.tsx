import React from 'react';
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">404</h1>
            <h2 className="text-xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
          </div>

          <p className="mt-4 text-center text-gray-600 mb-6">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate("/")}
              className="flex items-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
