import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  usePage,
  useUpdateBlock,
  useAddBlock,
  useRemoveBlock,
  useReorderBlocks,
} from '../../hooks/useSites';
import { useSiteEditorContext } from './SiteEditor';
import { BlockEditor } from '../components/BlockEditor';
import { AddBlockModal } from '../components/AddBlockModal';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { Block, BLOCK_TYPE_META } from '../../utils/types/sites';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

export const PageEditor: React.FC = () => {
  // CRITICAL: pageId comes ONLY from the URL parameter
  const { pageId } = useParams<{ pageId: string }>();
  const { siteId } = useSiteEditorContext();
  
  // Debug logging - verify page identity
  useEffect(() => {
    console.log('[CMS] PageEditor mounted');
    console.log('[CMS] siteId:', siteId);
    console.log('[CMS] pageId from URL:', pageId);
  }, [siteId, pageId]);

  // Validate pageId before proceeding
  if (!pageId) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No Page Selected</h2>
        <p className="text-slate-600">Select a page from the sidebar to start editing.</p>
      </div>
    );
  }

  // Validate pageId format (should not contain slashes or be a path)
  if (pageId.includes('/')) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Invalid Page ID</h2>
        <p className="text-slate-600">
          Page ID "{pageId}" is invalid. Expected a Firestore document ID.
        </p>
      </div>
    );
  }

  return <PageEditorContent siteId={siteId} pageId={pageId} />;
};

// Separate component to ensure hooks are called with valid pageId
const PageEditorContent: React.FC<{ siteId: string; pageId: string }> = ({
  siteId,
  pageId,
}) => {
  const { data: page, isLoading, error } = usePage(siteId, pageId);

  // All mutations use the explicit pageId from URL
  const updateBlockMutation = useUpdateBlock(siteId, pageId);
  const addBlockMutation = useAddBlock(siteId, pageId);
  const removeBlockMutation = useRemoveBlock(siteId, pageId);
  const reorderBlocksMutation = useReorderBlocks(siteId, pageId);

  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addPosition, setAddPosition] = useState<number | undefined>();

  // Log page data when loaded
  useEffect(() => {
    if (page) {
      console.log('[CMS] Page loaded:', {
        id: page.id,
        title: page.title,
        blocksCount: page.blocks?.length || 0,
      });
      
      // Verify page.id matches pageId from URL
      if (page.id !== pageId) {
        console.error('[CMS] PAGE ID MISMATCH!', {
          urlPageId: pageId,
          loadedPageId: page.id,
        });
      }
    }
  }, [page, pageId]);

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner text={`Loading page: ${pageId}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Page</h2>
        <p className="text-slate-600 mb-4">{(error as Error).message}</p>
        <code className="text-sm bg-slate-100 px-2 py-1 rounded">
          pageId: {pageId}
        </code>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-4">
          No page exists with ID: <code className="bg-slate-100 px-2 py-1 rounded">{pageId}</code>
        </p>
        <p className="text-sm text-slate-500">
          Expected Firestore path: sites/{siteId}/pages/{pageId}
        </p>
      </div>
    );
  }

  const toggleBlockExpanded = (blockId: string) => {
    setExpandedBlocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  };

  const handleSaveBlock = async (blockIndex: number, blockData: Block) => {
    // Log save operation for debugging
    console.log('[CMS] Saving block:', {
      siteId,
      pageId, // This is the Firestore doc ID from URL
      blockIndex,
      blockType: blockData.type,
    });

    try {
      await updateBlockMutation.mutateAsync({ blockIndex, blockData });
    } catch (error) {
      console.error('[CMS] Failed to save block:', error);
    }
  };

  const handleAddBlock = async (block: Block) => {
    console.log('[CMS] Adding block:', { siteId, pageId, blockType: block.type });
    
    try {
      await addBlockMutation.mutateAsync({ block, position: addPosition });
      setShowAddModal(false);
      setAddPosition(undefined);
      setExpandedBlocks((prev) => new Set([...prev, block.id]));
    } catch (error) {
      console.error('[CMS] Failed to add block:', error);
    }
  };

  const handleRemoveBlock = async (blockIndex: number) => {
    if (!confirm('Are you sure you want to delete this block?')) return;
    
    console.log('[CMS] Removing block:', { siteId, pageId, blockIndex });
    
    try {
      await removeBlockMutation.mutateAsync(blockIndex);
    } catch (error) {
      console.error('[CMS] Failed to remove block:', error);
    }
  };

  const handleMoveBlock = async (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= (page.blocks?.length || 0)) return;

    try {
      await reorderBlocksMutation.mutateAsync({ fromIndex, toIndex });
    } catch (error) {
      console.error('[CMS] Failed to reorder blocks:', error);
    }
  };

  const openAddModal = (position?: number) => {
    setAddPosition(position);
    setShowAddModal(true);
  };

  const blocks = page.blocks || [];

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{page.title}</h1>
            <p className="text-sm text-slate-500 font-mono">
              ID: {page.id}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => openAddModal()}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </button>
          </div>
        </div>
      </div>

      {/* Blocks List */}
      <div className="p-6 max-w-5xl mx-auto">
        {blocks.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-600 mb-4">This page has no blocks yet.</p>
            <button
              onClick={() => openAddModal()}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Block
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => {
              const isExpanded = expandedBlocks.has(block.id);
              const blockMeta = BLOCK_TYPE_META[block.type as keyof typeof BLOCK_TYPE_META];

              return (
                <div key={block.id || index}>
                  {/* Add block button above first block */}
                  {index === 0 && (
                    <div className="flex justify-center mb-4">
                      <button
                        onClick={() => openAddModal(0)}
                        className="flex items-center px-3 py-1 text-xs text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add block above
                      </button>
                    </div>
                  )}

                  {/* Block Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Block Header */}
                    <div
                      className="flex items-center px-4 py-3 bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition"
                      onClick={() => toggleBlockExpanded(block.id)}
                    >
                      <GripVertical className="h-5 w-5 text-slate-400 mr-3 cursor-grab" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-slate-900">
                            {blockMeta?.label || block.type}
                          </span>
                          <span className="ml-2 px-2 py-0.5 text-xs bg-slate-200 text-slate-600 rounded">
                            {block.type}
                          </span>
                        </div>
                        {'title' in block && block.title && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {block.title as string}
                          </p>
                        )}
                      </div>

                      {/* Block Actions */}
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(index, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(index, 'down');
                          }}
                          disabled={index === blocks.length - 1}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBlock(index);
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Expand/Collapse Indicator */}
                      <div
                        className={`ml-3 transform transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>

                    {/* Block Editor */}
                    {isExpanded && (
                      <div className="p-6">
                        <BlockEditor
                          block={block}
                          siteId={siteId}
                          pageId={pageId}
                          blockIndex={index}
                          onSave={(updatedBlock) => handleSaveBlock(index, updatedBlock)}
                          isSaving={updateBlockMutation.isPending}
                        />
                      </div>
                    )}
                  </div>

                  {/* Add block button below */}
                  <div className="flex justify-center my-4">
                    <button
                      onClick={() => openAddModal(index + 1)}
                      className="flex items-center px-3 py-1 text-xs text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add block below
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Block Modal */}
      <AddBlockModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setAddPosition(undefined);
        }}
        onAdd={handleAddBlock}
      />
    </div>
  );
};
