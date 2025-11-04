import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, ArrowRight, ArrowLeft, Building, BookOpen, Trash2, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Classroom {
  name: string;
  availableSlots: string[];
}

interface Course {
  name: string;
  lectures: string;
  labs: string;
  duration: string;
  professors: string[];
}

const Configure = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [classrooms, setClassrooms] = useState<Classroom[]>([{ name: "", availableSlots: [] }]);
  const [timeSlotInput, setTimeSlotInput] = useState<{[key: number]: string}>({});
  const [courses, setCourses] = useState<Course[]>([{ name: "", lectures: "", labs: "", duration: "", professors: [""] }]);

  const addClassroom = () => {
    setClassrooms([...classrooms, { name: "", availableSlots: [] }]);
  };

  const removeClassroom = (index: number) => {
    setClassrooms(classrooms.filter((_, i) => i !== index));
  };

  const updateClassroomName = (index: number, name: string) => {
    const updated = [...classrooms];
    updated[index].name = name;
    setClassrooms(updated);
  };

  const addTimeSlot = (classroomIndex: number) => {
    const slotValue = timeSlotInput[classroomIndex]?.trim();
    if (!slotValue) return;
    
    const updated = [...classrooms];
    if (!updated[classroomIndex].availableSlots.includes(slotValue)) {
      updated[classroomIndex].availableSlots.push(slotValue);
      setClassrooms(updated);
      setTimeSlotInput({ ...timeSlotInput, [classroomIndex]: "" });
    }
  };

  const removeTimeSlot = (classroomIndex: number, slotIndex: number) => {
    const updated = [...classrooms];
    updated[classroomIndex].availableSlots.splice(slotIndex, 1);
    setClassrooms(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", lectures: "", labs: "", duration: "", professors: [""] }]);
  };

  const updateCourse = (index: number, field: string, value: string) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const addProfessor = (courseIndex: number) => {
    const updated = [...courses];
    updated[courseIndex].professors.push("");
    setCourses(updated);
  };

  const removeProfessor = (courseIndex: number, profIndex: number) => {
    const updated = [...courses];
    updated[courseIndex].professors.splice(profIndex, 1);
    setCourses(updated);
  };

  const updateProfessor = (courseIndex: number, profIndex: number, value: string) => {
    const updated = [...courses];
    updated[courseIndex].professors[profIndex] = value;
    setCourses(updated);
  };

  const handleSubmit = () => {
    if (classrooms.some(c => !c.name || c.availableSlots.length === 0) || 
        courses.some(c => !c.name || !c.lectures || !c.duration || c.professors.some(p => !p))) {
      toast({
        title: "Incomplete configuration",
        description: "Please fill in all required fields including classroom names, time slots, course duration, and professors",
        variant: "destructive",
      });
      return;
    }

    // Check for professor conflicts
    const professorSchedule: {[key: string]: string[]} = {};
    let hasConflict = false;
    
    courses.forEach(course => {
      course.professors.forEach(prof => {
        if (!professorSchedule[prof]) {
          professorSchedule[prof] = [];
        }
        professorSchedule[prof].push(course.name);
      });
    });

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
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Classroom Configuration
                  </Label>
                  <Button variant="outline" size="sm" onClick={addClassroom}>
                    Add Classroom
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {classrooms.map((classroom, index) => (
                    <Card key={index} className="p-4 bg-muted/30">
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label htmlFor={`classroom-${index}`} className="text-sm">Classroom Name</Label>
                            <Input
                              id={`classroom-${index}`}
                              value={classroom.name}
                              onChange={(e) => updateClassroomName(index, e.target.value)}
                              placeholder="e.g., Room 101, Lab A"
                              className="mt-1"
                            />
                          </div>
                          {classrooms.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeClassroom(index)}
                              className="mt-6"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Available Time Slots
                          </Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              value={timeSlotInput[index] || ""}
                              onChange={(e) => setTimeSlotInput({ ...timeSlotInput, [index]: e.target.value })}
                              placeholder="e.g., 8:30-9:30, 10:00-11:00"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addTimeSlot(index);
                                }
                              }}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => addTimeSlot(index)}
                            >
                              Add
                            </Button>
                          </div>
                          {classroom.availableSlots.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {classroom.availableSlots.map((slot, slotIndex) => (
                                <div key={slotIndex} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-sm">
                                  {slot}
                                  <button 
                                    onClick={() => removeTimeSlot(index, slotIndex)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
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
                        <div className="grid grid-cols-3 gap-4">
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
                          <div>
                            <Label htmlFor={`duration-${index}`} className="text-sm">Duration (hours)</Label>
                            <Input
                              id={`duration-${index}`}
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={course.duration}
                              onChange={(e) => updateCourse(index, "duration", e.target.value)}
                              placeholder="e.g., 1"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Professors (for different divisions)
                            </Label>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => addProfessor(index)}
                            >
                              Add Professor
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {course.professors.map((prof, profIndex) => (
                              <div key={profIndex} className="flex gap-2">
                                <Input
                                  value={prof}
                                  onChange={(e) => updateProfessor(index, profIndex, e.target.value)}
                                  placeholder={`Professor ${profIndex + 1} name`}
                                />
                                {course.professors.length > 1 && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => removeProfessor(index, profIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
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
