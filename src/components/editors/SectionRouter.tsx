import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { HomeEditor } from '../../pages/sections/Home/HomeEditor';
import { AboutEditor } from '../../pages/sections/About/AboutEditor';
import { MenuEditor } from '../../pages/sections/Menu/MenuEditor';
import { EventsEditor } from '../../pages/sections/Events/EventsEditor';
import { GalleryEditor } from '../../pages/sections/Gallery/GalleryEditor';
import { ContactEditor } from '../../pages/sections/Contact/ContactEditor';
import { useTenant } from '../../hooks/useTenant';

export const SectionRouter: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { tenant } = useTenant();

  // Check if tenant has access to this section
  if (tenant && sectionId && !tenant.sections.includes(sectionId)) {
    return <Navigate to="/dashboard" replace />;
  }

  switch (sectionId) {
    case 'home':
      return <HomeEditor />;
    case 'about':
      return <AboutEditor />;
    case 'menu':
      return <MenuEditor />;
    case 'events':
      return <EventsEditor />;
    case 'gallery':
      return <GalleryEditor />;
    case 'contact':
      return <ContactEditor />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

