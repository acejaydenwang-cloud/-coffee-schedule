import React, { useState } from 'react';
import { CaffeineSensitivity, ScheduleResult, UserData } from './types';
import { calculateSchedule } from './utils/calculator';
import { Results } from './components/Results';
import { CoffeeIcon, ArrowRightIcon } from './components/Icons';

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [formData, setFormData] = useState<UserData>({
    height: 170,
    weight: 70,
    wakeTime: '07:00',
    bedTime: '23:00',
    sensitivity: CaffeineSensitivity.MEDIUM,
  });
  const [result, setResult] = useState<ScheduleResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'height' || name === 'weight' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = calculateSchedule(formData);
    setResult(schedule);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setStep('form');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 selection:bg-amber-200">
      
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-stone-200/50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-coffee-800 rounded-lg shadow-sm">
            <CoffeeIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-coffee-900">Coffee Smart Schedule</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        
        {step === 'form' && (
          <div className="animate-fade-in">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-extrabold text-coffee-900 mb-4 leading-tight">
                Master Your <br/> <span className="text-coffee-500">Caffeine Cycle</span>
              </h2>
              <p className="text-lg text-stone-600 max-w-md mx-auto">
                Optimize your energy and sleep using a scientific approach to your daily brew.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 space-y-8">
              
              {/* Biometrics */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                   <div className="h-px bg-stone-200 flex-1"></div>
                   <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">Biometrics</span>
                   <div className="h-px bg-stone-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 ml-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      required
                      min="50"
                      max="300"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-200 outline-none transition-all font-medium text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 ml-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      required
                      min="30"
                      max="300"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-200 outline-none transition-all font-medium text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700 ml-1">Sensitivity</label>
                  <div className="relative">
                    <select
                      name="sensitivity"
                      value={formData.sensitivity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-200 outline-none transition-all appearance-none font-medium text-lg text-stone-800"
                    >
                      <option value={CaffeineSensitivity.LOW}>Low (I can drink espresso at dinner)</option>
                      <option value={CaffeineSensitivity.MEDIUM}>Medium (Average tolerance)</option>
                      <option value={CaffeineSensitivity.HIGH}>High (Jitters easily, affects sleep)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-6 pt-4">
                 <div className="flex items-center gap-2 mb-4">
                   <div className="h-px bg-stone-200 flex-1"></div>
                   <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">Routine</span>
                   <div className="h-px bg-stone-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 ml-1">Wake Up</label>
                    <input
                      type="time"
                      name="wakeTime"
                      required
                      value={formData.wakeTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-200 outline-none transition-all font-medium text-lg cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 ml-1">Bedtime</label>
                    <input
                      type="time"
                      name="bedTime"
                      required
                      value={formData.bedTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-200 outline-none transition-all font-medium text-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full group bg-coffee-800 hover:bg-coffee-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-coffee-800/20 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                >
                  Generate Plan
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'results' && result && (
          <Results result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-stone-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Coffee Smart Schedule. Stay Alert, Sleep Well.</p>
      </footer>
      
      {/* Global simple animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;