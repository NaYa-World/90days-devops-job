import React, { useState } from 'react';
import { PHASES_V2 } from '../data/phasesV2';
import { DayData, Task } from '../data/phases';
import { UseAppStateReturnType } from '../hooks/useAppState';

const XP_MAP = { concept: 10, code: 25, quiz: 20, project: 50 };

const CATEGORY_ICONS: Record<string, string> = {
  concept: '💡',
  code: '⌨️',
  quiz: '🎤',
  project: '🚀',
};

const CATEGORY_COLORS: Record<string, string> = {
  concept: '#c084fc',
  code: '#00d9a0',
  quiz: '#ffc850',
  project: '#4fa8ff',
};

interface RoadmapV2ViewProps {
  appState: UseAppStateReturnType;
}

export const RoadmapV2View: React.FC<RoadmapV2ViewProps> = ({ appState }) => {
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({ 0: true });

  const toggleDay = (key: string) => {
    setOpenDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePhase = (idx: number) => {
    setOpenPhases(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="wrap">
      <div style={{ marginBottom: '14px' }}>
        <div className="eyebrow">Scenario-Based Learning</div>
        <h1 className="page-title">
          DevOps Roadmap{' '}
          <span
            style={{
              color: '#ff6b6b',
              fontSize: '14px',
              background: 'rgba(255,107,107,.12)',
              padding: '2px 10px',
              borderRadius: '12px',
              border: '1px solid rgba(255,107,107,.3)',
            }}
          >
            v2
          </span>
        </h1>
        <p className="page-sub">
          Real scenarios. Real problems. No hand-holding. Deploy first, learn by
          fixing what breaks.
        </p>
      </div>

      {/* Intro Banner */}
      <div
        className="banner"
        style={{
          borderColor: 'rgba(255,107,107,.3)',
          background: 'rgba(255,107,107,.06)',
        }}
      >
        <span>🔥</span>
        <span>
          This roadmap throws you into real production scenarios from Day 1.
          Every day starts with a problem you must solve — the same problems
          DevOps engineers face on the job.
        </span>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          padding: '12px 16px',
          background: 'var(--s2)',
          borderRadius: 'var(--r12)',
          border: '1px solid var(--border)',
        }}
      >
        {Object.entries(CATEGORY_ICONS).map(([k, icon]) => (
          <div
            key={k}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontFamily: 'var(--mono)',
              color: CATEGORY_COLORS[k],
            }}
          >
            <span style={{ fontSize: '14px' }}>{icon}</span>
            {k}
          </div>
        ))}
      </div>

      {/* Phases */}
      <div id="roadmap-wrap">
        {PHASES_V2.map((ph, pi) => {
          const isOpen = openPhases[pi] ?? false;
          const totalTasks = ph.data.reduce((a, d) => a + d.tasks.length, 0);

          return (
            <div
              key={pi}
              className="phase-card"
              style={{
                borderColor: ph.color,
                ['--pc' as any]: ph.color,
                ['--pcd' as any]: ph.dim,
              }}
            >
              {/* Phase Header */}
              <div className="phase-hdr" onClick={() => togglePhase(pi)}>
                <div
                  className="phase-icon"
                  style={{
                    background: ph.dim,
                    border: `1px solid ${ph.color}`,
                  }}
                >
                  {ph.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="phase-title">{ph.title}</div>
                  <div className="phase-meta">
                    {ph.days} · {totalTasks} tasks
                  </div>
                </div>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    color: 'var(--sub)',
                    flexShrink: 0,
                    transition: 'transform .3s',
                    transform: `rotate(${isOpen ? 180 : 0}deg)`,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Phase Body */}
              {isOpen && (
                <div className="phase-body open">
                  <div className="phase-body-inner">
                    <div className="phase-inner">
                      {ph.data.map((d, di) => {
                        const dayKey = `${pi}_${di}`;
                        const dOpen = openDays[dayKey] ?? false;

                        return (
                          <div key={di} className="day-block">
                            {/* Day Header */}
                            <div
                              className="day-hdr"
                              onClick={() => toggleDay(dayKey)}
                            >
                              <span
                                className="day-tag"
                                style={{
                                  background: ph.dim,
                                  color: ph.color,
                                  border: `1px solid ${ph.color}`,
                                }}
                              >
                                {d.day}
                              </span>
                              <span className="day-label">{d.label}</span>
                              <span
                                className="day-count"
                                style={{ color: 'var(--sub)' }}
                              >
                                {d.tasks.length} tasks
                              </span>
                              <svg
                                className={`day-chev ${dOpen ? 'open' : ''}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>

                            {/* Day Tasks */}
                            {dOpen && (
                              <div className="day-tasks open">
                                <div className="day-tasks-inner">
                                  {d.tasks.map((task, ti) => (
                                    <div key={ti} className="task-row">
                                      <div
                                        style={{
                                          width: '8px',
                                          height: '8px',
                                          borderRadius: '50%',
                                          background:
                                            CATEGORY_COLORS[task.k] ||
                                            'var(--sub)',
                                          flexShrink: 0,
                                          marginTop: '6px',
                                        }}
                                      />
                                      <div style={{ flex: 1 }}>
                                        <span
                                          className="task-text"
                                          style={{
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: 1.7,
                                          }}
                                        >
                                          {task.t}
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'flex-end',
                                          gap: '2px',
                                          flexShrink: 0,
                                        }}
                                      >
                                        <span
                                          className={`task-badge badge-${task.k}`}
                                        >
                                          {task.k}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
