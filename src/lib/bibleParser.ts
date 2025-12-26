// Bible Parser Utility for AlephBible
// Parses KJV text format: "BOOK CHAPTER:VERSE text..."
// Converts [bracketed words] to italics

export interface Verse {
  book: string;
  bookCode: string;
  chapter: number;
  verse: number;
  text: string;
  rawText: string;
}

export interface Chapter {
  book: string;
  bookCode: string;
  chapter: number;
  verses: Verse[];
}

export interface Book {
  name: string;
  code: string;
  chapters: Map<number, Chapter>;
}

export interface BibleData {
  books: Book[];
  booksByCode: Map<string, Book>;
}

// Book code to full name mapping
export const BOOK_NAMES: Record<string, string> = {
  'GEN': 'Genesis',
  'EXO': 'Exodus',
  'LEV': 'Leviticus',
  'NUM': 'Numbers',
  'DEU': 'Deuteronomy',
  'JOS': 'Joshua',
  'JDG': 'Judges',
  'RUT': 'Ruth',
  '1SA': '1 Samuel',
  '2SA': '2 Samuel',
  '1KI': '1 Kings',
  '2KI': '2 Kings',
  '1CH': '1 Chronicles',
  '2CH': '2 Chronicles',
  'EZR': 'Ezra',
  'NEH': 'Nehemiah',
  'EST': 'Esther',
  'JOB': 'Job',
  'PSA': 'Psalms',
  'PRO': 'Proverbs',
  'ECC': 'Ecclesiastes',
  'SNG': 'Song of Solomon',
  'ISA': 'Isaiah',
  'JER': 'Jeremiah',
  'LAM': 'Lamentations',
  'EZK': 'Ezekiel',
  'DAN': 'Daniel',
  'HOS': 'Hosea',
  'JOL': 'Joel',
  'AMO': 'Amos',
  'OBA': 'Obadiah',
  'JON': 'Jonah',
  'MIC': 'Micah',
  'NAM': 'Nahum',
  'HAB': 'Habakkuk',
  'ZEP': 'Zephaniah',
  'HAG': 'Haggai',
  'ZEC': 'Zechariah',
  'MAL': 'Malachi',
  'MAT': 'Matthew',
  'MRK': 'Mark',
  'LUK': 'Luke',
  'JHN': 'John',
  'ACT': 'Acts',
  'ROM': 'Romans',
  '1CO': '1 Corinthians',
  '2CO': '2 Corinthians',
  'GAL': 'Galatians',
  'EPH': 'Ephesians',
  'PHP': 'Philippians',
  'COL': 'Colossians',
  '1TH': '1 Thessalonians',
  '2TH': '2 Thessalonians',
  '1TI': '1 Timothy',
  '2TI': '2 Timothy',
  'TIT': 'Titus',
  'PHM': 'Philemon',
  'HEB': 'Hebrews',
  'JAS': 'James',
  '1PE': '1 Peter',
  '2PE': '2 Peter',
  '1JN': '1 John',
  '2JN': '2 John',
  '3JN': '3 John',
  'JUD': 'Jude',
  'REV': 'Revelation',
};

// Convert [bracketed words] to <em>italicized words</em>
export function formatVerseText(text: string): string {
  return text.replace(/\[([^\]]+)\]/g, '<em>$1</em>');
}

// Parse a single verse line: "GEN 1:1 In the beginning..."
export function parseVerseLine(line: string): Verse | null {
  const match = line.match(/^([A-Z0-9]+)\s+(\d+):(\d+)\s+(.+)$/);
  if (!match) return null;

  const [, bookCode, chapterStr, verseStr, text] = match;
  const bookName = BOOK_NAMES[bookCode] || bookCode;

  return {
    book: bookName,
    bookCode,
    chapter: parseInt(chapterStr, 10),
    verse: parseInt(verseStr, 10),
    text: formatVerseText(text),
    rawText: text,
  };
}

// Parse entire Bible text file
export function parseBibleText(text: string): BibleData {
  const lines = text.split('\n');
  const booksByCode = new Map<string, Book>();
  const books: Book[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip book name definition lines (e.g., "GEN = Genesis")
    if (trimmed.includes(' = ')) continue;

    const verse = parseVerseLine(trimmed);
    if (!verse) continue;

    let book = booksByCode.get(verse.bookCode);
    if (!book) {
      book = {
        name: verse.book,
        code: verse.bookCode,
        chapters: new Map(),
      };
      booksByCode.set(verse.bookCode, book);
      books.push(book);
    }

    let chapter = book.chapters.get(verse.chapter);
    if (!chapter) {
      chapter = {
        book: verse.book,
        bookCode: verse.bookCode,
        chapter: verse.chapter,
        verses: [],
      };
      book.chapters.set(verse.chapter, chapter);
    }

    chapter.verses.push(verse);
  }

  return { books, booksByCode };
}

// Get chapters for a specific book
export function getBookChapters(bible: BibleData, bookCode: string): number[] {
  const book = bible.booksByCode.get(bookCode);
  if (!book) return [];
  return Array.from(book.chapters.keys()).sort((a, b) => a - b);
}

// Get verses for a specific chapter
export function getChapterVerses(
  bible: BibleData,
  bookCode: string,
  chapter: number
): Verse[] {
  const book = bible.booksByCode.get(bookCode);
  if (!book) return [];
  const chapterData = book.chapters.get(chapter);
  return chapterData?.verses || [];
}

// Generate URL-friendly slug: "genesis6" format
export function generateChapterSlug(bookName: string, chapter: number): string {
  return `${bookName.toLowerCase().replace(/\s+/g, '')}${chapter}`;
}

// Parse chapter slug back to book and chapter
export function parseChapterSlug(slug: string): { book: string; chapter: number } | null {
  const match = slug.match(/^([a-z]+)(\d+)$/i);
  if (!match) return null;

  const [, bookPart, chapterStr] = match;
  const chapter = parseInt(chapterStr, 10);

  // Find matching book by normalized name
  for (const [code, name] of Object.entries(BOOK_NAMES)) {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    if (normalizedName === bookPart.toLowerCase()) {
      return { book: code, chapter };
    }
  }

  return null;
}
