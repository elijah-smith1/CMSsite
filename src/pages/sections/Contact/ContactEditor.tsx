import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../hooks/useTenant';
import { useSectionContent, useSaveSectionContent } from '../../../hooks/useFirebaseQuery';
import { ContactContent } from '../../../utils/types';
import { getDefaultSectionContent } from '../../../services/contentService';
import { TextInput } from '../../../components/inputs/TextInput';
import { SaveBar } from '../../../components/forms/SaveBar';
import { LoadingSpinner } from '../../../components/layout/LoadingSpinner';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactEditor: React.FC = () => {
  const { tenant } = useTenant();
  const { data, isLoading } = useSectionContent<ContactContent>(tenant?.id, 'contact');
  const { mutate: save, isPending } = useSaveSectionContent(tenant?.id || '', 'contact');

  const [content, setContent] = useState<ContactContent>(
    getDefaultSectionContent('contact') as ContactContent
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

  const updateContent = (updates: Partial<ContactContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
    setHasChanges(true);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading contact content..." />;
  }

  if (!tenant) {
    return <div>Please select a tenant</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h1>
        <p className="text-gray-600">Update your contact details and social media links</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <TextInput
          label="Page Title"
          value={content.title}
          onChange={(value) => updateContent({ title: value })}
          placeholder="Contact Us"
          required
        />

        <TextInput
          label="Subtitle (Optional)"
          value={content.subtitle || ''}
          onChange={(value) => updateContent({ subtitle: value })}
          placeholder="Get in touch with us"
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary-600" />
            Contact Details
          </h3>

          <TextInput
            label="Email Address"
            type="email"
            value={content.email}
            onChange={(value) => updateContent({ email: value })}
            placeholder="contact@example.com"
            required
          />

          <TextInput
            label="Phone Number"
            type="tel"
            value={content.phone}
            onChange={(value) => updateContent({ phone: value })}
            placeholder="(555) 123-4567"
            required
          />

          <div className="flex items-start mb-4">
            <MapPin className="h-5 w-5 mr-2 text-primary-600 mt-2" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content.address}
                onChange={(e) => updateContent({ address: e.target.value })}
                placeholder="123 Main St, City, State 12345"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-2 text-primary-600 mt-2" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Hours (Optional)
              </label>
              <textarea
                value={content.hours || ''}
                onChange={(e) => updateContent({ hours: e.target.value })}
                placeholder="Mon-Fri: 9AM - 5PM&#10;Sat: 10AM - 3PM&#10;Sun: Closed"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Social Media (Optional)</h3>

          <TextInput
            label="Facebook"
            type="url"
            value={content.socialMedia?.facebook || ''}
            onChange={(value) => updateSocialMedia('facebook', value)}
            placeholder="https://facebook.com/yourpage"
          />

          <TextInput
            label="Instagram"
            type="url"
            value={content.socialMedia?.instagram || ''}
            onChange={(value) => updateSocialMedia('instagram', value)}
            placeholder="https://instagram.com/yourhandle"
          />

          <TextInput
            label="Twitter"
            type="url"
            value={content.socialMedia?.twitter || ''}
            onChange={(value) => updateSocialMedia('twitter', value)}
            placeholder="https://twitter.com/yourhandle"
          />

          <TextInput
            label="LinkedIn"
            type="url"
            value={content.socialMedia?.linkedin || ''}
            onChange={(value) => updateSocialMedia('linkedin', value)}
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>
      </div>

      <SaveBar onSave={handleSave} isSaving={isPending} hasChanges={hasChanges} />
    </div>
  );
};

