import React, { useState } from 'react';
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
  Eye,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PageEditor: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const { siteId } = useSiteEditorContext();
  const { data: page, isLoading, refetch } = usePage(siteId, pageId);
  
  const updateBlockMutation = useUpdateBlock(siteId, pageId || '');
  const addBlockMutation = useAddBlock(siteId, pageId || '');
  const removeBlockMutation = useRemoveBlock(siteId, pageId || '');
  const reorderBlocksMutation = useReorderBlocks(siteId, pageId || '');

  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addPosition, setAddPosition] = useState<number | undefined>();

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner text="Loading page..." />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Page not found</p>
      </div>
    );
  }

  const toggleBlockExpanded = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const handleSaveBlock = async (blockIndex: number, blockData: Block) => {
    try {
      await updateBlockMutation.mutateAsync({ blockIndex, blockData });
    } catch (error) {
      console.error('Failed to save block:', error);
    }
  };

  const handleAddBlock = async (block: Block) => {
    try {
      await addBlockMutation.mutateAsync({ block, position: addPosition });
      setShowAddModal(false);
      setAddPosition(undefined);
      // Expand the new block
      setExpandedBlocks((prev) => new Set([...prev, block.id]));
    } catch (error) {
      console.error('Failed to add block:', error);
    }
  };

  const handleRemoveBlock = async (blockIndex: number) => {
    if (!confirm('Are you sure you want to delete this block?')) return;
    try {
      await removeBlockMutation.mutateAsync(blockIndex);
    } catch (error) {
      console.error('Failed to remove block:', error);
    }
  };

  const handleMoveBlock = async (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= page.blocks.length) return;
    
    try {
      await reorderBlocksMutation.mutateAsync({ fromIndex, toIndex });
    } catch (error) {
      console.error('Failed to reorder blocks:', error);
    }
  };

  const openAddModal = (position?: number) => {
    setAddPosition(position);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{page.title}</h1>
            <p className="text-sm text-slate-500">/{page.slug}</p>
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
        {page.blocks.length === 0 ? (
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
            {page.blocks.map((block, index) => {
              const isExpanded = expandedBlocks.has(block.id);
              const blockMeta = BLOCK_TYPE_META[block.type];

              return (
                <div key={block.id}>
                  {/* Add block button between blocks */}
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
                        {/* Show a preview based on block type */}
                        {'title' in block && block.title && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {block.title}
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
                          disabled={index === page.blocks.length - 1}
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
                      <div className={`ml-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>

                    {/* Block Editor */}
                    {isExpanded && (
                      <div className="p-6">
                        <BlockEditor
                          block={block}
                          siteId={siteId}
                          pageId={pageId || ''}
                          blockIndex={index}
                          onSave={(updatedBlock) => handleSaveBlock(index, updatedBlock)}
                          isSaving={updateBlockMutation.isPending}
                        />
                      </div>
                    )}
                  </div>

                  {/* Add block button between blocks */}
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

