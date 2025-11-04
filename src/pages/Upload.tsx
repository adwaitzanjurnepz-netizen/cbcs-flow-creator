import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a student data file to continue",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "File uploaded successfully",
      description: "Proceeding to configuration",
    });
    
    // Store file in localStorage for next step
    localStorage.setItem("uploadedFile", file.name);
    navigate("/configure");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Upload Student Data</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <UploadIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Student Data
              </h2>
              <p className="text-muted-foreground">
                Upload an Excel or CSV file containing student information
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="file-upload" className="text-base font-semibold">
                  Student Data File
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  File should include: Student names, Roll numbers, Enrolled courses
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Excel or CSV files only
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold text-foreground mb-2">Required Columns:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Student Name</li>
                  <li>• Roll Number</li>
                  <li>• Course 1, Course 2, ... (Enrolled courses)</li>
                </ul>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/")} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
