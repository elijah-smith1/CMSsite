import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSectionContent, saveSectionContent } from '../services/contentService';
import { SectionContent } from '../utils/types';
import toast from 'react-hot-toast';

/**
 * Hook to fetch section content with React Query
 */
export const useSectionContent = <T extends SectionContent>(
  tenantId: string | undefined,
  sectionId: string
) => {
  return useQuery({
    queryKey: ['section', tenantId, sectionId],
    queryFn: () => {
      if (!tenantId) throw new Error('Tenant ID is required');
      return getSectionContent<T>(tenantId, sectionId);
    },
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to save section content with React Query mutation
 */
export const useSaveSectionContent = (tenantId: string, sectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: SectionContent) => {
      return saveSectionContent(tenantId, sectionId, content);
    },
    onSuccess: () => {
      // Invalidate and refetch the section content
      queryClient.invalidateQueries({ queryKey: ['section', tenantId, sectionId] });
      toast.success('Content saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save content');
    },
  });
};

/**
 * Hook for auto-save functionality
 */
export const useAutoSave = <T extends SectionContent>(
  tenantId: string,
  sectionId: string,
  content: T,
  delay = 10000 // 10 seconds
) => {
  const { mutate } = useSaveSectionContent(tenantId, sectionId);
  const queryClient = useQueryClient();

  // Use React Query's built-in mutation without automatic toasts
  const autoSaveMutation = useMutation({
    mutationFn: (content: SectionContent) => {
      return saveSectionContent(tenantId, sectionId, content, false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', tenantId, sectionId] });
      toast.success('Auto-saved', { duration: 2000 });
    },
    onError: () => {
      // Silently fail for auto-save
    },
  });

  // Effect to trigger auto-save
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (content && tenantId && sectionId) {
        autoSaveMutation.mutate(content);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [content, delay, tenantId, sectionId]);

  return {
    save: mutate,
    isAutoSaving: autoSaveMutation.isPending,
  };
};

// Need to import React for useEffect
import React from 'react';

