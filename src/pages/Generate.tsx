import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Download, ArrowLeft, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockTimetable = {
  Monday: [
    { time: "8:30-9:30", course: "Data Structures", room: "101", type: "lecture" },
    { time: "9:30-10:30", course: "Algorithms", room: "102", type: "lecture" },
    { time: "10:30-11:30", course: "Database Systems", room: "103", type: "lecture" },
    { time: "11:30-12:30", course: "Operating Systems", room: "104", type: "lecture" },
    { time: "12:30-1:30", course: "Lunch Break", room: "-", type: "break" },
    { time: "1:30-3:30", course: "DS Lab", room: "Lab 1", type: "lab" },
  ],
  Tuesday: [
    { time: "8:30-9:30", course: "Computer Networks", room: "105", type: "lecture" },
    { time: "9:30-10:30", course: "Software Engineering", room: "106", type: "lecture" },
    { time: "10:30-11:30", course: "Web Technologies", room: "107", type: "lecture" },
    { time: "11:30-12:30", course: "Machine Learning", room: "108", type: "lecture" },
    { time: "12:30-1:30", course: "Lunch Break", room: "-", type: "break" },
    { time: "1:30-3:30", course: "Network Lab", room: "Lab 2", type: "lab" },
  ],
};

const Generate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate timetable generation
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Timetable generated successfully",
        description: "Your optimized timetable is ready",
      });
    }, 2000);
  }, []);

  const handleExport = (format: string) => {
    toast({
      title: `Exporting to ${format}`,
      description: "Your download will start shortly",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Generating Timetable...</h2>
          <p className="text-muted-foreground">This may take a few moments</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/configure")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Generated Timetable</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("PDF")}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("Excel")}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Sample Student</h3>
                  <p className="text-muted-foreground">Roll No: 2024001</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Division: A</p>
                <p className="text-sm text-muted-foreground">Batch: B1</p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            {Object.entries(mockTimetable).map(([day, slots]) => (
              <Card key={day} className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-4">
                  <h3 className="text-xl font-bold text-white">{day}</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          slot.type === "break"
                            ? "bg-muted/30"
                            : slot.type === "lab"
                            ? "bg-accent/10 border border-accent/20"
                            : "bg-primary/5 border border-primary/20"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{slot.time}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{slot.course}</p>
                          <p className="text-sm text-muted-foreground">Room: {slot.room}</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-background text-xs font-medium">
                          {slot.type.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
            >
              Generate New Timetable
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;
