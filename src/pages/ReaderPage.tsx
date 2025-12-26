import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useBible } from '@/hooks/useBible';
import { BOOK_NAMES } from '@/lib/bibleParser';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sun, Moon, Home, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ReaderPage() {
  const { theme, setTheme } = useTheme();
  const { isLoading, languages, getBooks, getChapters, getVerses, availableLanguages } = useBible();

  // State
  const [leftLanguage, setLeftLanguage] = useState('en-kjv');
  const [rightLanguage, setRightLanguage] = useState('ar');
  const [selectedBook, setSelectedBook] = useState('GEN');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);

  // Get data
  const books = getBooks(leftLanguage);
  const chapters = getChapters(leftLanguage, selectedBook);
  const leftVerses = getVerses(leftLanguage, selectedBook, selectedChapter);
  const rightVerses = getVerses(rightLanguage, selectedBook, selectedChapter);

  // Language data
  const leftLang = languages.find(l => l.code === leftLanguage);
  const rightLang = languages.find(l => l.code === rightLanguage);

  // Chapter title
  const bookName = BOOK_NAMES[selectedBook] || selectedBook;
  const chapterTitle = `${bookName} ${selectedChapter}`;

  // Navigation
  const goToPrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const goToNextChapter = () => {
    if (selectedChapter < chapters.length) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  // Clear highlight when changing chapter/book
  useEffect(() => {
    setHighlightedVerse(null);
  }, [selectedBook, selectedChapter]);

  // Ensure valid chapter when book changes
  useEffect(() => {
    if (chapters.length > 0 && !chapters.includes(selectedChapter)) {
      setSelectedChapter(chapters[0]);
    }
  }, [chapters, selectedChapter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Scripture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-scripture text-base font-bold text-primary-foreground">א</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground hidden sm:block">AlephBible</span>
            </Link>

            {/* Center Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-9 w-9"
                onClick={goToPrevChapter}
                disabled={selectedChapter <= 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <span className="font-display text-lg font-semibold text-foreground min-w-[140px] text-center">
                {chapterTitle}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-9 w-9"
                onClick={goToNextChapter}
                disabled={selectedChapter >= chapters.length}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-9 w-9"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Left Language */}
            <Select value={leftLanguage} onValueChange={setLeftLanguage}>
              <SelectTrigger className="h-11 rounded-xl bg-card border-border">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Left</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Right Language */}
            <Select value={rightLanguage} onValueChange={setRightLanguage}>
              <SelectTrigger className="h-11 rounded-xl bg-card border-border">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Right</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Book */}
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger className="h-11 rounded-xl bg-card border-border">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Book</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-80">
                {books.map((book) => (
                  <SelectItem key={book.code} value={book.code} className="rounded-lg">
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chapter */}
            <Select value={String(selectedChapter)} onValueChange={(v) => setSelectedChapter(Number(v))}>
              <SelectTrigger className="h-11 rounded-xl bg-card border-border">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Chapter</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-80">
                {chapters.map((chapter) => (
                  <SelectItem key={chapter} value={String(chapter)} className="rounded-lg">
                    {chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <main className="container mx-auto px-4 md:px-6 py-6">
        <div className="modern-card p-0 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {leftLang?.name || 'Left'}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {leftVerses.length} verses
                </span>
              </div>

              <ScrollArea className="h-[calc(100vh-320px)] custom-scrollbar">
                <div className="space-y-1 pr-4 stagger-children">
                  {leftVerses.map((verse) => (
                    <div
                      key={`left-${verse.verse}`}
                      onClick={() => setHighlightedVerse(verse.verse === highlightedVerse ? null : verse.verse)}
                      className={cn(
                        'flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200',
                        highlightedVerse === verse.verse ? 'bg-primary/10' : 'hover:bg-secondary'
                      )}
                    >
                      <span className="verse-pill flex-shrink-0">{verse.verse}</span>
                      <p
                        className="scripture-text flex-1 text-foreground"
                        dangerouslySetInnerHTML={{ __html: verse.text }}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-border flex-shrink-0" />

            {/* Right Column */}
            <div className={cn('flex-1 p-6 lg:p-8 border-t lg:border-t-0 border-border', rightLang?.isRTL && 'text-right')}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 className={cn('font-display text-xl font-bold text-foreground', rightLang?.isRTL && 'order-2')}>
                  {rightLang?.name || 'Right'}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {rightVerses.length} verses
                </span>
              </div>

              <ScrollArea className="h-[calc(100vh-320px)] custom-scrollbar">
                {rightVerses.length > 0 ? (
                  <div className={cn('space-y-1', rightLang?.isRTL ? 'pl-4' : 'pr-4', 'stagger-children')}>
                    {rightVerses.map((verse) => (
                      <div
                        key={`right-${verse.verse}`}
                        onClick={() => setHighlightedVerse(verse.verse === highlightedVerse ? null : verse.verse)}
                        className={cn(
                          'flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200',
                          rightLang?.isRTL && 'flex-row-reverse',
                          highlightedVerse === verse.verse ? 'bg-primary/10' : 'hover:bg-secondary'
                        )}
                      >
                        <span className="verse-pill flex-shrink-0">{verse.verse}</span>
                        <p
                          className={cn('scripture-text flex-1 text-foreground', rightLang?.isRTL && 'text-right')}
                          dir={rightLang?.isRTL ? 'rtl' : 'ltr'}
                          dangerouslySetInnerHTML={{ __html: verse.text }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-muted-foreground">
                    No {rightLang?.name || 'translation'} for this chapter
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReaderPage;
