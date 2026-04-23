"use client";

import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Activity as ActivityIcon, ArrowRight } from "lucide-react";
import { getActivity } from "../../services/marketplace";
import type { Activity } from "../../services/marketplace";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";

const activityTypeColors = {
  mint: "text-lime",
  transfer: "text-blue-400",
  sale: "text-emerald-glow",
  list: "text-purple-400",
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await getActivity(50);
        setActivities(data);
      } catch (err) {
        setError('Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight mb-2">
          Activity Feed
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          Real-time marketplace activity and transactions
        </p>
      </div>

      <Card className="bg-obsidian border-white/10 p-6">
        {loading ? (
          <Loading text="Loading activity..." />
        ) : error ? (
          <EmptyState
            icon={ActivityIcon}
            title="Failed to Load Activity"
            description={error}
          />
        ) : activities.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No Activity Yet"
            description="Activity will appear here as transactions occur"
          />
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-black/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Badge
                    variant="default"
                    className={`${activityTypeColors[activity.type]} uppercase text-[10px]`}
                  >
                    {activity.type}
                  </Badge>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-grotesk font-bold text-sm truncate">
                    {activity.assetTitle}
                  </p>
                  <div className="flex items-center gap-2 mt-1 font-mono text-xs text-text-secondary">
                    <span className="truncate">{activity.from}</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{activity.to}</span>
                  </div>
                </div>

                {activity.price && (
                  <div className="flex-shrink-0 text-right">
                    <p className="font-mono text-sm font-bold text-lime">{activity.price}</p>
                  </div>
                )}

                <div className="flex-shrink-0 text-right">
                  <p className="font-mono text-xs text-text-muted">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
