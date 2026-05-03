'use client';

import { useState, useEffect } from 'react';
import { Camera, Send } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setExplanation('');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateExplanation = async () => {
    if (!image) {
      alert('Please upload an image first!');
      return;
    }

    setLoading(true);

    try {
      const { pipeline } = await import('@xenova/transformers');

      // Real Gemma-4 compatible multimodal inference (small quantized version)
      const pipe = await pipeline(
        'image-to-text',
        'onnx-community/gemma-4-E2B-it-ONNX',
        {
          quantized: true,
          progress_callback: (data) => console.log('Gemma 4 loading:', data)
        }
      );

      const result = await pipe(image, {
        max_new_tokens: 250,
        temperature: 0.7,
      });

      setExplanation(`🧠 Real Gemma 4 Analysis:\n\n${result[0].generated_text || 'Analysis complete.'}`);
    } catch (error: any) {
      console.error('Gemma 4 error:', error);
      setExplanation(`Real Gemma 4 tried to analyze your image but hit an issue (first run can take 20-60s or need more memory).\n\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Register service worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(() => console.log('✅ Offline support active'))
          .catch((err) => console.log('Service Worker error:', err));
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-1 text-indigo-900">GemmaEdu Companion</h1>
        <p className="text-center text-indigo-600 mb-8">Offline AI Tutor • Powered by Gemma 4</p>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors min-h-[300px] flex items-center justify-center">
            {image ? (
              <img src={image} alt="Uploaded" className="max-h-64 rounded-2xl shadow-md" />
            ) : (
              <div>
                <Camera className="mx-auto h-16 w-16 text-indigo-400 mb-4" />
                <label className="cursor-pointer block">
                  <span className="text-indigo-700 font-medium text-lg">Upload a textbook page or photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </label>
              </div>
            )}
          </div>

          {image && (
            <button
              onClick={generateExplanation}
              disabled={loading}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-lg transition-all"
            >
              {loading ? (
                <>🤖 Loading real Gemma 4...</>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Get Gemma 4 Explanation
                </>
              )}
            </button>
          )}

          {explanation && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-900 text-base leading-relaxed whitespace-pre-wrap font-medium">
              {explanation}
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-500 mt-10">
          100% offline • Real Gemma 4 • Gemma 4 Good Hackathon
        </div>
      </div>
    </div>
  );
}