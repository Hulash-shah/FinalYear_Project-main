import React from 'react';
import Card from '../../components/ui/Card';
import { C } from '../../theme/colors';

const ActivityFeed = ({ activities, onViewAll }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>Recent Activity</h3>
      {onViewAll && activities.length > 0 && (
        <span
          onClick={onViewAll}
          style={{ fontSize: "0.72rem", color: C.accent, cursor: "pointer" }}
        >
          View all →
        </span>
      )}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {activities.map((a, i) => (
        <div
          key={i}
          onClick={onViewAll}
          style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: onViewAll ? "pointer" : "default" }}
        >
          <div 
            style={{ 
              width: 7, 
              height: 7, 
              borderRadius: "50%", 
              background: a.type === "success" ? C.success : a.type === "warning" ? C.warning : a.type === "info" ? C.info : C.textDim, 
              marginTop: 5, 
              flexShrink: 0 
            }}
          />
          <div>
            <p style={{ fontSize: "0.81rem", color: C.text, lineHeight: 1.4 }}>{a.text}</p>
            <p style={{ fontSize: "0.71rem", color: C.textDim, marginTop: 2 }}>{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default ActivityFeed;