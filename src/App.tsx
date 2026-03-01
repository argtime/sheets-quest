import React, { useState, useRef } from 'react';
import { Upload, Download, Plus, Trash2, FileSpreadsheet, Settings, Image as ImageIcon, Shield, FileText, X, BookOpen, Info, CheckCircle2, RotateCcw, Share2, Copy, Check } from 'lucide-react';
import { processImage, ProcessedImage } from './utils/pixelProcessor';
import { generatePixelArtSheet, Question, SheetOptions } from './utils/sheetGenerator';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [image, setImage] = useState<ProcessedImage | null>(null);
  
  const MAX_QUESTIONS = 40;

  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', answer: '' },
    { id: '2', text: '', answer: '' },
    { id: '3', text: '', answer: '' },
    { id: '4', text: '', answer: '' },
    { id: '5', text: '', answer: '' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('SheetsQuest_Activity');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [options, setOptions] = useState<SheetOptions>({
    ignoreCaps: true,
    ignoreSpaces: true,
    ignoreAccents: false,
  });

  // Modal State
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);

  // Custom instructions for the generated sheet
  const [customInstructions, setCustomInstructions] = useState('');

  // Persist "do not show again" preference
  const doNotShowGoogleSheetsPrompt = () => localStorage.getItem('hideGoogleSheetsPrompt') === 'true';

  // Sharing
  const [linkCopied, setLinkCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };
  const shareText = encodeURIComponent('Check out Sheets Quest – turn pixel art into interactive Google Sheets quizzes for students! 🎨📊 Free for teachers!');
  const shareUrl = encodeURIComponent(window.location.href);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const processed = await processImage(file);
      setImage(processed);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDownload = async () => {
    if (!image) return;
    const validQuestions = questions.filter(q => q.text.trim() || q.answer.trim());
    if (validQuestions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    setIsGenerating(true);
    try {
      const name = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
      await generatePixelArtSheet(image, validQuestions, name, { ...options, customInstructions: customInstructions || undefined });
    } catch (error) {
      console.error('Error generating sheet:', error);
      alert('Failed to generate sheet');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      alert('Please upload an image first');
      return;
    }
    const validQuestions = questions.filter(q => q.text.trim() || q.answer.trim());
    if (validQuestions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    if (!doNotShowGoogleSheetsPrompt()) {
      setShowDownloadPrompt(true);
    }
    await executeDownload();
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), text: '', answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleClearAll = () => {
    if (!confirm('Are you sure you want to clear everything? This cannot be undone.')) return;
    setImage(null);
    setQuestions([
      { id: '1', text: '', answer: '' },
      { id: '2', text: '', answer: '' },
      { id: '3', text: '', answer: '' },
      { id: '4', text: '', answer: '' },
      { id: '5', text: '', answer: '' },
    ]);
    setFileName('SheetsQuest_Activity');
    setCustomInstructions('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateQuestion = (index: number, field: 'text' | 'answer', value: string) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleUploadKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-emerald-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <FileSpreadsheet size={24} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              Sheets Quest
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setShowHowTo(true)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all text-sm font-medium"
              aria-label="How it works"
            >
              <Info size={16} aria-hidden="true" />
              <span className="hidden sm:inline">How it works</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-sm font-medium"
              aria-label="Clear everything"
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
            <button
              onClick={handleGenerate}
              disabled={!image || isGenerating}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 text-sm"
              aria-live="polite"
              aria-label={isGenerating ? 'Generating sheet, please wait' : 'Download generated sheet'}
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <Download size={18} aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{isGenerating ? 'Generating…' : 'Download'}</span>
              <span className="sm:hidden">{isGenerating ? '…' : ''}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 flex-grow">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Image Upload Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-emerald-500" />
              Pixel Art Image
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={handleUploadKeyDown}
              role="button"
              tabIndex={0}
              aria-label={image ? 'Change pixel art image' : 'Upload pixel art image'}
              className={`
                rounded-xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden group
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
                ${image ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}
              `}
              style={image ? { aspectRatio: `${image.width} / ${image.height}`, maxHeight: '16rem' } : { minHeight: '8rem' }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                aria-label="Upload pixel art image file"
                className="hidden"
              />
              
              {image ? (
                <div className="w-full h-full relative flex items-center justify-center p-2">
                  <div 
                    className="grid shadow-lg"
                    style={{
                      gridTemplateColumns: `repeat(${image.width}, 1fr)`,
                      gridTemplateRows: `repeat(${image.height}, 1fr)`,
                      aspectRatio: `${image.width} / ${image.height}`,
                      width: '100%',
                      maxHeight: '100%'
                    }}
                  >
                    {image.grid.map((row, y) => (
                      row.map((pixel, x) => (
                        <div 
                          key={`${x}-${y}`}
                          style={{ backgroundColor: pixel.hex }}
                        />
                      ))
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium rounded-xl">
                    Click to Change
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium">Upload Image</p>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10" role="status" aria-label="Processing image">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings size={20} className="text-slate-500" />
              Settings
            </h2>
            <div className="space-y-3" role="group" aria-label="Answer matching options">
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <span className="text-sm font-medium text-slate-700">Ignore Capitalization</span>
                <div className="relative inline-flex items-center shrink-0">
                  <input 
                    type="checkbox" 
                    checked={options.ignoreCaps}
                    onChange={(e) => setOptions({...options, ignoreCaps: e.target.checked})}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <span className="text-sm font-medium text-slate-700">Ignore Extra Spaces</span>
                <div className="relative inline-flex items-center shrink-0">
                  <input 
                    type="checkbox" 
                    checked={options.ignoreSpaces}
                    onChange={(e) => setOptions({...options, ignoreSpaces: e.target.checked})}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <span className="text-sm font-medium text-slate-700">Ignore Accents</span>
                <div className="relative inline-flex items-center shrink-0">
                  <input 
                    type="checkbox" 
                    checked={options.ignoreAccents}
                    onChange={(e) => setOptions({...options, ignoreAccents: e.target.checked})}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Questions */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold">Questions & Answers</h2>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                  questions.length >= MAX_QUESTIONS 
                    ? 'bg-amber-50 text-amber-600 border-amber-200' 
                    : 'bg-white text-slate-500 border-slate-200'
                }`}>
                  {questions.length} / {MAX_QUESTIONS} Questions
                </span>
              </div>
            </div>

            {/* Activity name & instructions */}
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/30 space-y-3">
              <div>
                <label htmlFor="activity-name" className="block text-sm font-medium text-slate-700 mb-1">Activity Name</label>
                <input
                  id="activity-name"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                  placeholder="Activity Name"
                />
              </div>
              <div>
                <label htmlFor="custom-instructions" className="block text-sm font-medium text-slate-700 mb-1">Custom Instructions <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea
                  id="custom-instructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Instructions: Type your answers to reveal the pixel art. Good luck!"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">This text will appear as the instructions line in the generated sheet.</p>
              </div>
            </div>
            
            {questions.length >= MAX_QUESTIONS && (
              <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 text-amber-800 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Maximum of 40 questions reached.
              </div>
            )}
            
            <div className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {questions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 sm:p-6 group hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                        {i + 1}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`question-${q.id}-text`} className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Question
                          </label>
                          <textarea
                            id={`question-${q.id}-text`}
                            value={q.text}
                            onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                            placeholder="Type your question here..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm resize-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`question-${q.id}-answer`} className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Answer
                          </label>
                          <input
                            id={`question-${q.id}-answer`}
                            type="text"
                            value={q.answer}
                            onChange={(e) => updateQuestion(i, 'answer', e.target.value)}
                            placeholder="Correct answer"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => removeQuestion(i)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 mt-1"
                        aria-label={`Remove question ${i + 1}`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={addQuestion}
                disabled={questions.length >= MAX_QUESTIONS}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              >
                <Plus size={20} />
                {questions.length >= MAX_QUESTIONS ? 'Max Questions Reached' : 'Add New Question'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">

          {/* Sharing section */}
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Share2 size={16} className="text-emerald-500" aria-hidden="true" />
              Share Sheets Quest with other educators
            </p>
            <div className="flex items-center flex-wrap justify-center gap-2">
              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter / X"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 transition-all text-sm font-medium"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X / Twitter
              </a>
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all text-sm font-medium"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              {/* Reddit */}
              <a
                href={`https://reddit.com/submit?url=${shareUrl}&title=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Reddit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm font-medium"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                Reddit
              </a>
              {/* Copy link */}
              <button
                onClick={handleCopyLink}
                aria-label={linkCopied ? 'Link copied!' : 'Copy link to clipboard'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  linkCopied
                    ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
                    : 'border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {linkCopied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {linkCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Legal row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
              <span>&copy; 2026 Sheets Quest</span>
              <button onClick={() => setShowPrivacy(true)} className="hover:text-emerald-600 transition-colors underline-offset-2 hover:underline">Privacy Policy</button>
              <button onClick={() => setShowTerms(true)} className="hover:text-emerald-600 transition-colors underline-offset-2 hover:underline">Terms of Service</button>
            </div>
            <div className="text-xs text-slate-400 text-center md:text-right max-w-md">
              Free to share and use in the classroom. Output cannot be sold or used commercially.
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowPrivacy(false)}
            aria-hidden="true"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-xl"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="privacy-dialog-title"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="privacy-dialog-title" className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="text-emerald-500" aria-hidden="true" /> Privacy Policy
                </h2>
                <button onClick={() => setShowPrivacy(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close privacy policy">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="prose prose-slate text-sm">
                <p><strong>Last Updated: March 1, 2026</strong></p>
                <p>This Privacy Policy describes how Sheets Quest ("we", "us", or "our") handles your information when you use our free educational tool.</p>
                
                <h3>1. Data Collection</h3>
                <p>We do not collect, store, or transmit any personal data or uploaded images to external servers. All image processing and spreadsheet generation happens entirely within your browser (client-side). Your images, questions, and answers never leave your device.</p>
                
                <h3>2. Local Storage</h3>
                <p>We may use your browser's local storage to temporarily save your preferences (such as settings toggles) to improve your experience. This data never leaves your device and can be cleared at any time through your browser settings.</p>
                
                <h3>3. Third-Party Services</h3>
                <p>This application is hosted on a platform that may collect basic usage logs (IP addresses, request times) for security and operational purposes. We do not sell or share any such data with third parties for advertising purposes.</p>
                <p>This site contains links to third-party sharing services (Twitter/X, Facebook, Reddit). Clicking these links will open those platforms in a new tab and their respective privacy policies will apply. We do not track clicks on these sharing links.</p>

                <h3>4. Social Sharing</h3>
                <p>We provide optional social sharing buttons to help you share the Sheets Quest tool with other educators. Using these buttons will open a new tab to the respective social platform. No data about your activity on this site is shared with those platforms unless you actively click those buttons and interact with those platforms.</p>
                
                <h3>5. Children's Privacy</h3>
                <p>This tool is designed to be safe for use in educational settings. We do not knowingly collect any personal information from children under the age of 13. Because all processing is done locally in the browser, no data is transmitted from any user.</p>

                <h3>6. Changes to This Policy</h3>
                <p>We may update this Privacy Policy from time to time. Any changes will be reflected with an updated "Last Updated" date above.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowTerms(false)}
            aria-hidden="true"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-xl"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="terms-dialog-title"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="terms-dialog-title" className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-emerald-500" aria-hidden="true" /> Terms of Service
                </h2>
                <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close terms of service">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="prose prose-slate text-sm">
                <p><strong>Effective Date: March 1, 2026</strong></p>
                
                <h3>1. License &amp; Usage</h3>
                <p>Sheets Quest is provided as a free tool for educational and personal use. Content generated using this tool (the "Output") — including downloaded spreadsheet files — is free to be shared and distributed for non-commercial purposes.</p>
                <p className="font-bold text-red-600">RESTRICTION: You may NOT sell the Output, nor use the Output as part of a paid product or service. You may NOT sell modifications of this project or the Output.</p>
                
                <h3>2. Sharing &amp; Distribution</h3>
                <p>You are encouraged to share this tool with other educators, teachers, and students. You may link to or share this website freely. The social sharing buttons provided on this site are offered as a convenience and their use is entirely optional and voluntary.</p>

                <h3>3. Acceptable Use</h3>
                <p>You agree to use this tool only for lawful purposes. You may not upload images or create content that is offensive, defamatory, or violates any applicable laws or third-party rights.</p>

                <h3>4. Disclaimer of Warranties</h3>
                <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. We are not responsible for any errors in the generated spreadsheets or any data loss.</p>
                
                <h3>5. User Content</h3>
                <p>You retain all rights to the images and questions you upload. By using this tool, you represent that you have the right to use any images you upload and that doing so does not infringe on any third-party intellectual property rights.</p>
                
                <h3>6. Modifications to Terms</h3>
                <p>We reserve the right to modify these terms at any time. Continued use of the tool after changes are posted constitutes your acceptance of the revised terms.</p>

                <h3>7. Copyright</h3>
                <p>&copy; 2026 Sheets Quest. All rights reserved. The Sheets Quest application, its source code, and its user interface are protected by copyright law.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowTo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowHowTo(false)}
            aria-hidden="true"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-xl"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="howto-dialog-title"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="howto-dialog-title" className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="text-emerald-500" aria-hidden="true" /> How It Works
                </h2>
                <button onClick={() => setShowHowTo(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close how it works">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-6 text-sm text-slate-700">
                <p className="text-base text-slate-600">
                  <strong>Sheets Quest</strong> turns pixel art images into interactive quiz-style spreadsheets. Students answer questions to gradually reveal a hidden pixel art picture — making review and practice more engaging!
                </p>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 text-base">Creating Your Sheet</h3>
                  {[
                    { step: 1, title: 'Upload a pixel art image', desc: 'Click the image upload area and choose any pixel art image. Smaller, high-contrast images with clearly distinct colors work best.' },
                    { step: 2, title: 'Add your questions & answers', desc: 'Type in your questions and their correct answers in the panel on the right. Each correct answer will unlock a portion of the hidden picture.' },
                    { step: 3, title: 'Adjust settings (optional)', desc: 'Use the Settings panel to choose whether to ignore capitalization, extra spaces, or accents when checking answers.' },
                    { step: 4, title: 'Download your sheet', desc: 'Click "Download Sheet" to generate and download an .xlsx spreadsheet file ready to share with students.' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-sm">
                        {step}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{title}</p>
                        <p className="text-slate-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-emerald-900 text-base flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" /> How students use it
                  </h3>
                  <p className="text-emerald-800">Students open the spreadsheet, type their answers in the white input boxes next to each question, and watch the pixel art reveal itself as they get answers correct. Wrong answers show in red, correct answers in green.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-emerald-500" /> Opening in Google Sheets
                  </h3>
                  <p className="text-slate-500 text-xs">The downloaded <code className="bg-slate-200 px-1 py-0.5 rounded">.xlsx</code> file works in both Microsoft Excel and Google Sheets. To open in Google Sheets:</p>
                  <ol className="space-y-1 text-xs text-slate-600 list-none">
                    {[
                      'Go to sheets.google.com and open a blank spreadsheet.',
                      'Click File → Import.',
                      'Select the Upload tab, then choose your downloaded .xlsx file.',
                      'Choose "Replace spreadsheet" or "Insert new sheet(s)", then click Import data.',
                      'Make copies for each student — they type answers to reveal the pixel art!',
                    ].map((step, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Prompt Modal (Google Sheets info) */}
      <AnimatePresence>
        {showDownloadPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            aria-hidden="true"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 shadow-xl"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="download-dialog-title"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="download-dialog-title" className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="text-emerald-500" aria-hidden="true" /> Open in Google Sheets
                </h2>
              </div>

              <p className="text-sm text-slate-600 mb-5">Your sheet is downloading! Here's how to open it in Google Sheets:</p>

              <div className="space-y-3 mb-6">
                {[
                  <>Go to <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">sheets.google.com</a> and open a blank spreadsheet.</>,
                  <>Click <strong>File</strong> → <strong>Import</strong>.</>,
                  <>Select the <strong>Upload</strong> tab and choose your downloaded <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">.xlsx</code> file.</>,
                  <>Choose <strong>Replace spreadsheet</strong> or <strong>Insert new sheet(s)</strong>, then click <strong>Import data</strong>.</>,
                  <>Make copies for each student — they type answers to reveal the pixel art!</>,
                ].map((desc, i) => (
                  <div key={i} className="flex gap-3 items-start text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {i + 1}
                    </div>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem('hideGoogleSheetsPrompt', 'true');
                    setShowDownloadPrompt(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  Don't show again
                </button>
                <button
                  onClick={() => setShowDownloadPrompt(false)}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
