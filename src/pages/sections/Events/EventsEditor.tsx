import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../hooks/useTenant';
import { useSectionContent, useSaveSectionContent } from '../../../hooks/useFirebaseQuery';
import { EventsContent, Event } from '../../../utils/types';
import { getDefaultSectionContent } from '../../../services/contentService';
import { TextInput } from '../../../components/inputs/TextInput';
import { ImageUpload } from '../../../components/inputs/ImageUpload';
import { SaveBar } from '../../../components/forms/SaveBar';
import { LoadingSpinner } from '../../../components/layout/LoadingSpinner';
import { RepeaterField } from '../../../components/forms/RepeaterField';
import { generateId } from '../../../utils/formatters';

export const EventsEditor: React.FC = () => {
  const { tenant } = useTenant();
  const { data, isLoading } = useSectionContent<EventsContent>(tenant?.id, 'events');
  const { mutate: save, isPending } = useSaveSectionContent(tenant?.id || '', 'events');

  const [content, setContent] = useState<EventsContent>(
    getDefaultSectionContent('events') as EventsContent
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const handleSave = () => {
    save(content);
    setHasChanges(false);
  };

  const updateContent = (updates: Partial<EventsContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading events content..." />;
  }

  if (!tenant) {
    return <div>Please select a tenant</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600">Manage your upcoming events and activities</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6 mb-6">
        <TextInput
          label="Page Title"
          value={content.title}
          onChange={(value) => updateContent({ title: value })}
          placeholder="Upcoming Events"
          required
        />

        <TextInput
          label="Subtitle (Optional)"
          value={content.subtitle || ''}
          onChange={(value) => updateContent({ subtitle: value })}
          placeholder="Join us for these exciting events"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <RepeaterField
          label="Events"
          items={content.events}
          onChange={(events) => updateContent({ events })}
          createNewItem={() => ({
            id: generateId(),
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
          })}
          addButtonText="Add Event"
          emptyText="No events yet. Click 'Add Event' to create one."
          renderItem={(event, index, updateItem) => (
            <div className="space-y-4">
              <TextInput
                label="Event Title"
                value={event.title}
                onChange={(value) => updateItem({ title: value })}
                placeholder="Event title"
              />

              <TextInput
                label="Description"
                value={event.description}
                onChange={(value) => updateItem({ description: value })}
                placeholder="Brief description of the event"
              />

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Date"
                  type="text"
                  value={event.date}
                  onChange={(value) => updateItem({ date: value })}
                  placeholder="YYYY-MM-DD"
                />

                <TextInput
                  label="Time"
                  type="text"
                  value={event.time}
                  onChange={(value) => updateItem({ time: value })}
                  placeholder="7:00 PM"
                />
              </div>

              <TextInput
                label="Location"
                value={event.location}
                onChange={(value) => updateItem({ location: value })}
                placeholder="Event venue or address"
              />

              <ImageUpload
                label="Event Image (Optional)"
                value={event.image || ''}
                onChange={(value) => updateItem({ image: value })}
                tenantId={tenant.id}
                section="events"
                aspectRatio="16/9"
              />

              <TextInput
                label="Registration Link (Optional)"
                type="url"
                value={event.registrationLink || ''}
                onChange={(value) => updateItem({ registrationLink: value })}
                placeholder="https://example.com/register"
              />
            </div>
          )}
        />
      </div>

      <SaveBar onSave={handleSave} isSaving={isPending} hasChanges={hasChanges} />
    </div>
  );
};

