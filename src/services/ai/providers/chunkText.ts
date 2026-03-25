export const emitTextChunks = async (
  text: string,
  onChunk: (chunk: string) => void,
  chunkSize = 48
): Promise<void> => {
  for (let index = 0; index < text.length; index += chunkSize) {
    onChunk(text.slice(index, index + chunkSize));
  }
};
