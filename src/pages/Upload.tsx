import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet, ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FileBucket {
  id: string;
  bucketName: string;
  file: File | null;
}

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fileBuckets, setFileBuckets] = useState<FileBucket[]>([
    { id: "1", bucketName: "", file: null }
  ]);

  const addFileBucket = () => {
    const newId = Date.now().toString();
    setFileBuckets([...fileBuckets, { id: newId, bucketName: "", file: null }]);
  };

  const removeFileBucket = (id: string) => {
    if (fileBuckets.length === 1) {
      toast({
        title: "Cannot remove",
        description: "At least one file bucket is required",
        variant: "destructive",
      });
      return;
    }
    setFileBuckets(fileBuckets.filter(bucket => bucket.id !== id));
  };

  const updateBucketName = (id: string, name: string) => {
    setFileBuckets(fileBuckets.map(bucket => 
      bucket.id === id ? { ...bucket, bucketName: name } : bucket
    ));
  };

  const updateBucketFile = (id: string, file: File | null) => {
    setFileBuckets(fileBuckets.map(bucket => 
      bucket.id === id ? { ...bucket, file } : bucket
    ));
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateBucketFile(id, e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Validate all buckets have both name and file
    const incompleteBuckets = fileBuckets.filter(b => !b.bucketName.trim() || !b.file);
    
    if (incompleteBuckets.length > 0) {
      toast({
        title: "Incomplete information",
        description: "Please provide bucket name and file for all entries",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate bucket names
    const bucketNames = fileBuckets.map(b => b.bucketName.trim().toLowerCase());
    const hasDuplicates = bucketNames.some((name, idx) => bucketNames.indexOf(name) !== idx);
    
    if (hasDuplicates) {
      toast({
        title: "Duplicate bucket names",
        description: "Each course bucket must have a unique name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Files uploaded successfully",
      description: "Proceeding to configuration",
    });
    
    // Store file buckets in localStorage for next step
    const bucketData = fileBuckets.map(b => ({
      bucketName: b.bucketName,
      fileName: b.file!.name,
      fileSize: b.file!.size
    }));
    localStorage.setItem("courseBuckets", JSON.stringify(bucketData));
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
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    Course Bucket Files
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addFileBucket}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Bucket
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload different Excel/CSV files for each course bucket (elective group) from which students choose courses
                </p>
                
                <div className="space-y-4">
                  {fileBuckets.map((bucket) => (
                    <Card key={bucket.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Label htmlFor={`bucket-name-${bucket.id}`} className="text-sm font-medium">
                              Bucket Name
                            </Label>
                            <Input
                              id={`bucket-name-${bucket.id}`}
                              placeholder="e.g., Technical Electives, Core Electives"
                              value={bucket.bucketName}
                              onChange={(e) => updateBucketName(bucket.id, e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          {fileBuckets.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFileBucket(bucket.id)}
                              className="mt-6"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                          <Input
                            id={`file-upload-${bucket.id}`}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => handleFileChange(bucket.id, e)}
                            className="hidden"
                          />
                          <label htmlFor={`file-upload-${bucket.id}`} className="cursor-pointer">
                            {bucket.file ? (
                              <div className="flex items-center justify-center gap-3">
                                <FileSpreadsheet className="h-6 w-6 text-primary" />
                                <div className="text-left">
                                  <p className="font-medium text-foreground text-sm">{bucket.file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(bucket.file.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <UploadIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground mb-1">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Excel or CSV files only
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold text-foreground mb-2">Required Columns in Each File:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Student Name</li>
                  <li>• Roll Number</li>
                  <li>• Courses enrolled from this bucket</li>
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
