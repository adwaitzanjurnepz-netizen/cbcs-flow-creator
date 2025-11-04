import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, ArrowRight, ArrowLeft, Building, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Configure = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [classrooms, setClassrooms] = useState("");
  const [courses, setCourses] = useState([{ name: "", lectures: "", labs: "" }]);

  const addCourse = () => {
    setCourses([...courses, { name: "", lectures: "", labs: "" }]);
  };

  const updateCourse = (index: number, field: string, value: string) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const handleSubmit = () => {
    if (!classrooms || courses.some(c => !c.name || !c.lectures)) {
      toast({
        title: "Incomplete configuration",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuration saved",
      description: "Proceeding to timetable generation",
    });

    // Store configuration
    localStorage.setItem("config", JSON.stringify({ classrooms, courses }));
    navigate("/generate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/upload")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Configure Parameters</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Configure Constraints
              </h2>
              <p className="text-muted-foreground">
                Set up classrooms and course requirements
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <Label htmlFor="classrooms" className="text-base font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Number of Available Classrooms
                </Label>
                <Input
                  id="classrooms"
                  type="number"
                  min="1"
                  value={classrooms}
                  onChange={(e) => setClassrooms(e.target.value)}
                  placeholder="e.g., 10"
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Configuration
                  </Label>
                  <Button variant="outline" size="sm" onClick={addCourse}>
                    Add Course
                  </Button>
                </div>

                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <Card key={index} className="p-4 bg-muted/30">
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor={`course-${index}`} className="text-sm">Course Name</Label>
                          <Input
                            id={`course-${index}`}
                            value={course.name}
                            onChange={(e) => updateCourse(index, "name", e.target.value)}
                            placeholder="e.g., Data Structures"
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`lectures-${index}`} className="text-sm">Lectures per Week</Label>
                            <Input
                              id={`lectures-${index}`}
                              type="number"
                              min="0"
                              value={course.lectures}
                              onChange={(e) => updateCourse(index, "lectures", e.target.value)}
                              placeholder="e.g., 3"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`labs-${index}`} className="text-sm">Labs per Week</Label>
                            <Input
                              id={`labs-${index}`}
                              type="number"
                              min="0"
                              value={course.labs}
                              onChange={(e) => updateCourse(index, "labs", e.target.value)}
                              placeholder="e.g., 2"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">System Constraints:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• College hours: 8:30 AM - 9:30 PM</li>
                  <li>• Lunch break: 12:30 PM - 1:30 PM</li>
                  <li>• Max lecture strength: 100 students</li>
                  <li>• Max lab strength: 25 students</li>
                </ul>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/upload")} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                >
                  Generate Timetable
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

export default Configure;
