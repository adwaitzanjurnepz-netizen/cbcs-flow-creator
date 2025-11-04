import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Settings, Calendar, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">CBCS Timetable Generator</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Generate Your Custom Timetable
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to create optimized, clash-free timetables for all students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate("/upload")}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">1. Upload Data</h3>
              <p className="text-muted-foreground">
                Upload student data with names, roll numbers, and enrolled courses
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate("/configure")}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">2. Configure</h3>
              <p className="text-muted-foreground">
                Set classrooms, lecture counts, and lab requirements
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate("/generate")}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">3. Generate</h3>
              <p className="text-muted-foreground">
                Auto-generate optimized timetables with minimal idle time
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Key Features
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Automatic division and batch creation</li>
                  <li>✓ Clash-free scheduling with lunch breaks</li>
                  <li>✓ Optimized classroom utilization</li>
                  <li>✓ Individual student timetables</li>
                  <li>✓ Export to PDF and Excel</li>
                </ul>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg"
                onClick={() => navigate("/upload")}
              >
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
