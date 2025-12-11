import React, { useState } from 'react';
import { Block } from '../../hooks/usePageData';

interface SessionItem {
  name?: string;
  time?: string;
  day?: string;
  category?: string;
  instructor?: string;
  location?: string;
}

interface ScheduleProps extends Partial<Block> {
  sessions?: SessionItem[];
  filters?: string[];
}

export const Schedule: React.FC<ScheduleProps> = ({
  title,
  subtitle,
  sessions,
  filters,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!sessions || sessions.length === 0) {
    return null;
  }

  // Filter sessions
  const filteredSessions = activeFilter
    ? sessions.filter((s) => s.category === activeFilter)
    : sessions;

  // Group by day if days exist
  const days = [...new Set(sessions.map((s) => s.day).filter(Boolean))];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Filters */}
        {filters && filters.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Schedule Grid */}
        {days.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day) => (
              <div key={day} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  {day}
                </h3>
                <div className="space-y-3">
                  {filteredSessions
                    .filter((s) => s.day === day)
                    .map((session, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.name}
                          </p>
                          {session.instructor && (
                            <p className="text-sm text-gray-500">
                              {session.instructor}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-primary-600 font-medium">
                          {session.time}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y">
              {filteredSessions.map((session, i) => (
                <div key={i} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{session.name}</p>
                    {session.instructor && (
                      <p className="text-sm text-gray-500">
                        {session.instructor}
                      </p>
                    )}
                    {session.location && (
                      <p className="text-sm text-gray-500">{session.location}</p>
                    )}
                  </div>
                  <span className="text-primary-600 font-medium">
                    {session.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

