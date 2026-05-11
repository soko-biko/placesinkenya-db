import React, { useState, useEffect, useRef } from 'react';
import { Users, Calendar, MapPin, Star } from 'lucide-react';

export const StatsBar: React.FC = () => {
    const stats = [
        { label: 'Places', value: 2500, suffix: '+', icon: <MapPin size={24} /> },
        { label: 'Events', value: 120, suffix: '+', icon: <Calendar size={24} /> },
        { label: 'Guides', value: 500, suffix: '+', icon: <Users size={24} /> },
        { label: 'Average Rating', value: 4.8, suffix: '', icon: <Star size={24} /> },
    ];

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 bg-navy text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-safari group-hover:scale-110 group-hover:bg-safari group-hover:text-white transition-all duration-500">
                                {stat.icon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                                    {isVisible ? <CountUp end={stat.value} duration={2000} decimals={stat.value % 1 !== 0 ? 1 : 0} /> : '0'}
                                    <span className="text-safari">{stat.suffix}</span>
                                </h3>
                                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CountUp: React.FC<{ end: number; duration: number; decimals?: number }> = ({ end, duration, decimals = 0 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(progress * end);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration]);

    return <span>{count.toFixed(decimals)}</span>;
};
