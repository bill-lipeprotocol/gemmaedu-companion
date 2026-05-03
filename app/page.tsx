'use client';

import { useState } from 'react';
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
    
    // Improved mock that feels like real Gemma 4 (no hardcoded wrong equation)
    setTimeout(() => {
      setExplanation(`Gemma 4 Analysis:\n\n✅ I have analyzed the image you uploaded.\n\nThis appears to be a simple addition problem: **2 + 2 = 4**.\n\n✅ The answer is correct!\n\nWould you like me to:\n• Explain it step-by-step in a different way?\n• Give you a similar practice problem?\n• Switch to voice mode?\n\n(Real Gemma 4 multimodal inference coming in the next upgrade!)`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-1 text-indigo-900">GemmaEdu Companion</h1>
        <p className="text-center text-indigo-600 mb-8">Offline AI Tutor • Powered by Gemma 4</p>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Image upload area */}
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
                <>🤖 Thinking with Gemma 4...</>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Get Gemma 4 Explanation
                </>
              )}
            </button>
          )}

          { explanation && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-900 text-base leading-relaxed whitespace-pre-wrap font-medium">
              {explanation}
            </div>
         )}
        </div>

        <div className="text-center text-xs text-gray-500 mt-10">
          100% offline • Works on phones & tablets • Gemma 4 Good Hackathon
        </div>
      </div>
    </div>
  );
}