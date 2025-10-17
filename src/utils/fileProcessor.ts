export interface ProcessedDocument {
  text: string;
  title: string;
  wordCount: number;
  estimatedDuration: number; // in minutes
}

export class DocumentProcessor {
  static async processFile(file: File): Promise<ProcessedDocument> {
    const text = await this.extractText(file);
    const wordCount = this.countWords(text);
    const estimatedDuration = this.estimateDuration(wordCount);
    
    return {
      text,
      title: file.name.replace(/\.[^/.]+$/, ''),
      wordCount,
      estimatedDuration
    };
  }

  private static async extractText(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType === 'text/plain') {
      return await file.text();
    }
    
    if (fileType === 'application/pdf') {
      // For PDF files, we'd need a PDF parser library
      // For now, return a placeholder
      return 'PDF text extraction would be implemented here with a PDF parsing library.';
    }
    
    if (fileType.includes('word') || fileType.includes('document')) {
      // For Word documents, we'd need a document parser
      return 'Word document text extraction would be implemented here.';
    }
    
    // Fallback to treating as text
    return await file.text();
  }

  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private static estimateDuration(wordCount: number): number {
    // Average speaking rate is about 150-160 words per minute
    // We'll use 150 WPM as baseline
    return Math.ceil(wordCount / 150);
  }

  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:00`;
    }
    return `${mins}:00`;
  }
}