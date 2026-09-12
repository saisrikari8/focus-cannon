"use client";

import PageContainer from "@/components/layout/PageContainer";
import FocusEngine from "@/components/focus/FocusEngine";
import { Flame, Sliders } from "lucide-react";

export default function FocusPage() {
  return (
    <PageContainer
      title="Focus Mode"
      description="Distraction-free environment with intelligent website blocking, app enforcement, and deep focus timers."
      icon={<Flame className="w-5 h-5" />}
      badge="Shield Standing By"
      badgeType="success"
    >
      <FocusEngine />
    </PageContainer>
  );
}
