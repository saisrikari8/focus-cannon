import { AIInsightReport, Mission } from "./types";

export interface AIPlanRequest {
  courses: string[];
  hoursAvailable: number;
  urgency: "normal" | "exam_cram" | "save_me";
}

export async function generateAIStudyMissions(
  request: AIPlanRequest,
  userApiKey?: string
): Promise<Mission[]> {
  try {
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "missions",
        courses: request.courses,
        hoursAvailable: request.hoursAvailable,
        urgency: request.urgency,
        userApiKey,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.missions && Array.isArray(data.data.missions)) {
        return data.data.missions.map((m: Partial<Mission>, idx: number) => ({
          id: `groq-mission-${Date.now()}-${idx}`,
          course: m.course || request.courses[0] || "CS301",
          title: m.title || "Targeted Study Mission",
          description: m.description || "High-priority concept review & problem solving.",
          estimatedMinutes: m.estimatedMinutes || 45,
          xpReward: m.xpReward || 150,
          priority: m.priority || "high",
          status: "pending",
          syllabusCoverage: m.syllabusCoverage || 80,
          createdAt: new Date().toISOString(),
        }));
      }
    }
  } catch (e) {
    console.warn("Client fetch to /api/groq failed, using local fallback generator:", e);
  }

  return generateFallbackMissions(request);
}

function generateFallbackMissions(request: AIPlanRequest): Mission[] {
  const now = new Date().toISOString();
  if (request.urgency === "save_me") {
    return [
      {
        id: `m-save-${Date.now()}-1`,
        course: request.courses[0] || "CS301",
        title: "Sprint 1: Emergency Concept Breakdown",
        description: "High-yield topic focus on core exam formulas & recurrence relations.",
        estimatedMinutes: 45,
        xpReward: 200,
        priority: "high",
        status: "pending",
        syllabusCoverage: 85,
        createdAt: now,
      },
      {
        id: `m-save-${Date.now()}-2`,
        course: request.courses[0] || "CS301",
        title: "Sprint 2: Past Exam Problem Patterns",
        description: "Solve 3 high-probability past paper questions with strict timer.",
        estimatedMinutes: 45,
        xpReward: 180,
        priority: "high",
        status: "pending",
        syllabusCoverage: 75,
        createdAt: now,
      },
    ];
  }

  return [
    {
      id: `m-gen-${Date.now()}-1`,
      course: request.courses[0] || "CS301",
      title: "Algorithmic Complexity & Dynamic Programming",
      description: "Review top-down memoization vs bottom-up tabulation techniques.",
      estimatedMinutes: 45,
      xpReward: 150,
      priority: "high",
      status: "pending",
      syllabusCoverage: 88,
      createdAt: now,
    },
    {
      id: `m-gen-${Date.now()}-2`,
      course: request.courses[1] || "MATH202",
      title: "Eigenvalues & Basis Transformations",
      description: "Practice characteristic equation derivations and diagonal matrices.",
      estimatedMinutes: 50,
      xpReward: 160,
      priority: "medium",
      status: "pending",
      syllabusCoverage: 70,
      createdAt: now,
    },
  ];
}

export async function generateAIWeeklyReport(
  sessionsCount: number,
  totalHours: number,
  userApiKey?: string
): Promise<AIInsightReport> {
  try {
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "weekly_report",
        sessionsCount,
        totalHours,
        userApiKey,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return {
          generatedAt: new Date().toISOString(),
          summary: data.data.summary || "Peak consistency achieved during morning deep work blocks.",
          peakFocusWindow: data.data.peakFocusWindow || "9:00 AM – 11:30 AM",
          recommendedFocusHours: data.data.recommendedFocusHours || "4.5 Hours / Day",
          weakTopics: data.data.weakTopics || ["Dynamic Programming Graph Edge Cases", "Vector Orthogonality"],
          focusScore: data.data.focusScore || 88,
        };
      }
    }
  } catch (e) {
    console.warn("Report generation error, using fallback report:", e);
  }

  return {
    generatedAt: new Date().toISOString(),
    summary:
      "Your peak focus productivity occurs between 9:00 AM – 11:30 AM. Thursday evening distraction attempts spiked by 15%. Recommended action: Schedule CS301 complex problem sets in morning blocks.",
    peakFocusWindow: "9:00 AM – 11:30 AM",
    recommendedFocusHours: "4.0 Hours / Day",
    weakTopics: ["Graph Traversal Edge Cases", "Eigenvalue Proofs"],
    focusScore: 88,
  };
}
