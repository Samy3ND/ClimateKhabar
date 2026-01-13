import React, { useEffect, useState } from 'react';
import { MapPin, RefreshCw, AlertTriangle, ShieldCheck, Thermometer, Wind, Droplets } from 'lucide-react';

const ClimateStats = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWeather = async (coords = null) => {
        setRefreshing(true);
        try {
            let url = '/api/weather/current';
            const params = new URLSearchParams();
            if (coords) {
                params.append('lat', coords.latitude);
                params.append('lon', coords.longitude);
            } else {
                params.append('city', 'Kathmandu');
            }
            const res = await fetch(`${url}?${params.toString()}`);
            const data = await res.json();
            setWeather(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords),
                () => fetchWeather(null)
            );
        } else { fetchWeather(null); }
    }, []);

    const getAQIConfig = (aqi) => {
        const configs = {
            1: { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500', note: 'Perfect air quality.' },
            2: { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500', note: 'Acceptable air.' },
            3: { label: 'Sensitive', color: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500', note: 'Avoid long stays outside.' },
            4: { label: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500', note: 'Health risk! Stay inside.' },
            5: { label: 'Hazardous', color: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-500', note: 'Dangerous! Close windows.' }
        };
        return configs[aqi] || configs[1];
    };

    if (loading) return (
        <div className="max-w-6xl mx-auto px-4 mt-8 animate-pulse">
            <div className="h-32 bg-slate-100 rounded-3xl"></div>
        </div>
    );

    if (!weather) return null;

    const { current, location, alerts } = weather;
    const aqi = getAQIConfig(current.aqi);
    const hasAlerts = alerts && alerts.length > 0;

    return (
        <section className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden">
                {/* Horizontal Layout Container */}
                <div className="flex flex-col lg:flex-row items-stretch">
                    
                    {/* 1. WEATHER SECTION */}
                    <div className="flex-1 p-8 flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-slate-100">
                        <div className="relative">
                            <div className="absolute inset-0 bg-sky-400/10 blur-2xl rounded-full"></div>
                            <img src={current.condition.icon} className="relative w-20 h-20" alt="weather" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <MapPin size={14} className="text-sky-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">{location.name}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{current.temp_c}°</h2>
                                <span className="text-lg font-medium text-slate-400">/ {current.feelslike_c}°</span>
                            </div>
                            <p className="text-slate-600 font-semibold">{current.condition.text}</p>
                        </div>
                    </div>

                    {/* 2. AIR QUALITY SECTION (Visual Gauge) */}
                    <div className={`flex-[1.2] p-8 ${aqi.bg} flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100`}>
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Air Quality</h3>
                                <p className={`text-2xl font-black ${aqi.color}`}>{aqi.label}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 leading-tight">{aqi.note}</p>
                            </div>
                        </div>
                        
                        {/* The Gauge */}
                        <div className="relative h-4 w-full bg-black/5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out ${aqi.bar}`}
                                style={{ width: `${(current.aqi / 5) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 px-1">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className={`w-1 h-1 rounded-full ${current.aqi >= step ? 'bg-black/20' : 'bg-black/5'}`} />
                            ))}
                        </div>
                    </div>

                    {/* 3. ALERTS & REFRESH SECTION */}
                    <div className="flex-1 p-8 flex flex-col justify-center relative">
                        <button 
                            onClick={() => fetchWeather()}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-sky-500 transition-colors"
                        >
                            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        </button>

                        {hasAlerts ? (
                            <div className="flex items-start gap-4 text-red-600">
                                <div className="p-3 bg-red-100 rounded-2xl animate-bounce">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest leading-none mb-1">Live Alert</h4>
                                    <p className="text-sm font-bold leading-tight line-clamp-2">{alerts[0].event}</p>
                                    <p className="text-[10px] opacity-70 mt-1">Check local news for details</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 text-emerald-600">
                                <div className="p-3 bg-emerald-100 rounded-2xl">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest leading-none mb-1">Safety Status</h4>
                                    <p className="text-sm font-bold">Everything is safe</p>
                                    <p className="text-[10px] opacity-70 mt-1 uppercase tracking-tighter">No active threats detected</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Micro-footer for technical bits */}
                <div className="bg-slate-50/50 px-8 py-3 flex justify-between items-center border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5"><Wind size={12} className="text-sky-400" /> {current.wind_kph} km/h</span>
                        <span className="flex items-center gap-1.5"><Droplets size={12} className="text-blue-400" /> {current.humidity}% Humidity</span>
                    </div>
                    <span>Last Sync: {current.last_updated}</span>
                </div>
            </div>
        </section>
    );
};

export default ClimateStats;