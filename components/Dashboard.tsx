import React, { useEffect, useState } from 'react';
import { KeywordMetric, TrendDirection } from '../types';
import { fetchTrendingKeywords } from '../services/geminiService';
import { TrendingUp, TrendingDown, Minus, RefreshCw, BarChart2, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<KeywordMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const keywords = await fetchTrendingKeywords();
    setData(keywords);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format volume for chart
  const chartData = data.slice(0, 7).map(d => ({
    name: d.keyword,
    volume: d.searchVolume,
    rank: d.rank
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="총 트래픽 (예상)" 
          value={data.reduce((acc, curr) => acc + curr.searchVolume, 0).toLocaleString()} 
          subtitle="Top 10 키워드 기준"
          icon={<BarChart2 className="text-blue-400" />}
        />
        <StatCard 
          title="급상승 키워드" 
          value={data.filter(d => d.trend === TrendDirection.UP).length.toString()} 
          subtitle="전일 대비 상승"
          icon={<TrendingUp className="text-green-400" />}
        />
        <StatCard 
          title="평균 경쟁 강도" 
          value="High" 
          subtitle="메인 키워드 기준"
          icon={<ActivityIcon className="text-orange-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">상위 키워드 검색량 분석</h2>
              <p className="text-sm text-slate-400">실시간 추정 검색량 (Daily)</p>
            </div>
            <button 
                onClick={loadData}
                disabled={loading}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="h-[300px] w-full">
            {loading ? (
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#4ade80' }}
                        cursor={{ fill: '#334155', opacity: 0.4 }}
                    />
                    <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index < 3 ? '#22c55e' : '#3b82f6'} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Real-time Ranking List */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                실시간 급상승 순위
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
             {loading ? (
                 <div className="p-6 space-y-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-10 bg-slate-700/50 rounded-lg animate-pulse" />
                    ))}
                 </div>
             ) : (
                 <ul className="divide-y divide-slate-700/50">
                    {data.map((item, idx) => (
                        <li key={item.keyword} className="p-4 flex items-center hover:bg-slate-700/30 transition-colors">
                            <span className={`
                                w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold mr-4
                                ${idx < 3 ? 'bg-green-500 text-slate-900' : 'bg-slate-700 text-slate-400'}
                            `}>
                                {item.rank}
                            </span>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-slate-200">{item.keyword}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-400">{item.competition}</span>
                                    <span className="text-[10px] text-slate-500">{item.searchVolume.toLocaleString()} hits</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium w-12 justify-end">
                                {item.trend === TrendDirection.UP && (
                                    <span className="text-red-400 flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> {item.change}
                                    </span>
                                )}
                                {item.trend === TrendDirection.DOWN && (
                                    <span className="text-blue-400 flex items-center">
                                        <TrendingDown className="w-3 h-3 mr-1" /> {item.change}
                                    </span>
                                )}
                                {item.trend === TrendDirection.STABLE && (
                                    <span className="text-slate-500 flex items-center">
                                        <Minus className="w-3 h-3 mr-1" /> -
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                 </ul>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon }: any) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
            <span className="text-slate-500">{subtitle}</span>
        </div>
    </div>
);

const ActivityIcon = ({ className }: { className?: string }) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
