"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Calendar as CalendarIcon, Clock, Plus, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CalendarPage() {
  const { calendarEvents, addCalendarEvent, syncGoogleCalendar } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New event form state
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("CS301 Algorithms");
  const [date, setDate] = useState("2026-09-20");
  const [time, setTime] = useState("10:00 AM");
  const [type, setType] = useState<"exam" | "assignment" | "focus_block">("exam");

  const handleSync = async () => {
    setIsSyncing(true);
    await syncGoogleCalendar();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addCalendarEvent({
      title,
      course,
      date,
      time,
      type,
      status: "upcoming",
    });
    setTitle("");
    setIsModalOpen(false);
  };

  return (
    <PageContainer
      title="Calendar"
      description="Manage upcoming academic deadlines, exam dates, and automated Google Calendar study block sync."
      icon={<CalendarIcon className="w-5 h-5" />}
      badge="Google Calendar Sync Active"
      badgeType="indigo"
      actionSlot={
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-lg bg-[#121821] border border-[#1E2638] text-zinc-300 hover:text-white hover:border-[#2A364F] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Syncing Calendar...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sync Google Calendar</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Calendar Overview Grid */}
        <div className="lg:col-span-2 bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
            <h3 className="font-bold text-base text-zinc-100">September 2026 Academic Schedule</h3>
            <span className="text-xs text-indigo-400 font-semibold">{calendarEvents.length} Events Logged</span>
          </div>

          {/* Interactive Event Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {calendarEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl bg-[#0B0F14] border border-[#1E2638] space-y-2 hover:border-[#2A364F] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      evt.type === "exam"
                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                        : evt.type === "assignment"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                    }`}
                  >
                    {evt.type}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold">{evt.date}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-zinc-100">{evt.title}</h4>
                  <p className="text-xs text-zinc-400">{evt.course}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1E2638] text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" /> {evt.time}
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines Sidebar */}
        <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-zinc-100 border-b border-[#1E2638] pb-3">
            Upcoming Exam & Assignment Deadlines
          </h3>

          <div className="space-y-3">
            {calendarEvents.slice(0, 4).map((evt) => (
              <div key={evt.id} className="p-3 rounded-lg bg-[#0B0F14] border border-[#1E2638] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{evt.title}</span>
                  <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">
                    {evt.date}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{evt.course}</p>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 pt-1">
                  <Clock className="w-3 h-3" /> {evt.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121821] border border-[#1E2638] rounded-2xl p-6 max-w-md w-full space-y-4 text-zinc-100 shadow-2xl">
            <h3 className="text-lg font-bold">Add Academic Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. CS301 Midterm Exam"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Course Name</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Event Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="focus_block">Focus Block</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-400 hover:text-zinc-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
