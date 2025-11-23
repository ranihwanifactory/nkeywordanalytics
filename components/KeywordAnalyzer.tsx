import React, { useState } from 'react';
import { analyzeSpecificKeyword } from '../services/geminiService';
import { KeywordAnalysisResult } from '../types';
import { Search, ArrowRight, CheckCircle2, AlertCircle, Zap, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const KeywordAnalyzer: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KeywordAnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setResult(null);
    
    try {
      const data = await analyzeSpecificKeyword(keyword);
      setResult(data);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Input Area */}
      <div className="bg-gradient-to-br from-green-900/40 to-slate-800 rounded-3xl p-8 border border-green-500/20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
        <h2 className="text-3xl font-bold text-white mb-4">키워드 심층 분석</h2>
        <p className="text-slate-300 mb-8 max-w-lg mx-auto">
          AI를 통해 키워드의 경쟁 강도, 예상 검색량, 그리고 연관 검색어를 분석하여 최적의 SEO 전략을 수립하세요.
        </p>

        <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="분석할 키워드를 입력하세요 (예: 맛집, 캠핑)"
            className="w-full pl-6 pr-14 py-4 bg-slate-900/80 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-xl transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 p-2.5 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {loading && (
          <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full mb-4 animate-pulse">
                <Search className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-slate-400">Gemini AI가 키워드 데이터를 분석 중입니다...</p>
          </div>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in-up">
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard 
                    title="SEO 난이도" 
                    score={result.difficultyScore} 
                    description="상위 노출 진입 장벽"
                    color="red"
                />
                <ScoreCard 
                    title="성장 잠재력" 
                    score={result.potentialScore} 
                    description="향후 트래픽 증가 예상치"
                    color="green"
                />
            </div>

            {/* Chart and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                        계절성 트렌드 (예상)
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={result.seasonalTrend}>
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                            AI 전략 조언
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {result.summary}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4">연관 키워드</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.relatedKeywords.map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-green-500 hover:text-green-500 transition-colors cursor-pointer">
                                # {tag}
                            </span>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-700">
                         <h4 className="text-sm font-semibold text-slate-400 mb-4">플랫폼별 분석 (Beta)</h4>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-300">Blog View</span>
                                <span className="text-green-400 font-medium">Very High</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[85%]"></div>
                            </div>

                            <div className="flex justify-between items-center text-sm mt-2">
                                <span className="text-slate-300">Shopping</span>
                                <span className="text-yellow-400 font-medium">Medium</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-yellow-400 h-full w-[50%]"></div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const ScoreCard = ({ title, score, description, color }: any) => {
    const isGreen = color === 'green';
    return (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center gap-6">
            <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" className="stroke-slate-700" strokeWidth="8" fill="transparent" />
                    <circle 
                        cx="40" cy="40" r="36" 
                        className={isGreen ? "stroke-green-500" : "stroke-red-500"} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={226}
                        strokeDashoffset={226 - (226 * score) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{score}</span>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400 mb-2">{description}</p>
                <div className={`text-xs px-2 py-1 rounded inline-block font-semibold ${isGreen ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {score > 70 ? (isGreen ? '매우 좋음' : '매우 어려움') : score > 40 ? '보통' : (isGreen ? '낮음' : '쉬움')}
                </div>
            </div>
        </div>
    )
}