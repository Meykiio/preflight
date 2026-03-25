/**
 * Checkpoint configuration for generation progress
 * Saves progress every 500 tokens to enable resume
 */
export interface CheckpointConfig {
  intervalTokens: number;
  storageKey: string;
  autoResume: boolean;
}

export const DEFAULT_CHECKPOINT_CONFIG: CheckpointConfig = {
  intervalTokens: 500,
  storageKey: 'preflight_generation_checkpoint',
  autoResume: true
};

/**
 * Generation checkpoint data
 */
export interface GenerationCheckpoint {
  projectId: string;
  agentType: string;
  content: string;
  tokenCount: number;
  timestamp: number;
  status: 'in-progress' | 'complete' | 'failed';
}

/**
 * Save checkpoint to localStorage
 */
export const saveCheckpoint = (checkpoint: GenerationCheckpoint): void => {
  try {
    localStorage.setItem(
      DEFAULT_CHECKPOINT_CONFIG.storageKey,
      JSON.stringify(checkpoint)
    );
  } catch (error) {
    console.warn('Failed to save generation checkpoint:', error);
  }
};

/**
 * Load checkpoint from localStorage
 */
export const loadCheckpoint = (): GenerationCheckpoint | null => {
  try {
    const data = localStorage.getItem(DEFAULT_CHECKPOINT_CONFIG.storageKey);
    if (!data) return null;
    
    const checkpoint = JSON.parse(data) as GenerationCheckpoint;
    
    // Invalidate checkpoints older than 24 hours
    const oneDay = 24 * 60 * 60 * 1000;
    if (Date.now() - checkpoint.timestamp > oneDay) {
      clearCheckpoint();
      return null;
    }
    
    return checkpoint;
  } catch (error) {
    console.warn('Failed to load generation checkpoint:', error);
    return null;
  }
};

/**
 * Clear checkpoint from localStorage
 */
export const clearCheckpoint = (): void => {
  try {
    localStorage.removeItem(DEFAULT_CHECKPOINT_CONFIG.storageKey);
  } catch (error) {
    console.warn('Failed to clear generation checkpoint:', error);
  }
};

/**
 * Estimate token count from text (simple character-based estimation)
 */
export const estimateTokenCount = (text: string): number =>
  Math.ceil(text.length / 4);

/**
 * Check if content should trigger a checkpoint save
 */
export const shouldSaveCheckpoint = (
  currentTokens: number,
  lastCheckpointTokens: number,
  config: CheckpointConfig = DEFAULT_CHECKPOINT_CONFIG
): boolean =>
  currentTokens - lastCheckpointTokens >= config.intervalTokens;

/**
 * Resume incomplete generation
 * Returns null if no checkpoint or generation was complete
 */
export const resumeGeneration = (): GenerationCheckpoint | null => {
  const checkpoint = loadCheckpoint();
  
  if (!checkpoint) return null;
  if (checkpoint.status === 'complete') {
    clearCheckpoint();
    return null;
  }
  
  return checkpoint;
};
