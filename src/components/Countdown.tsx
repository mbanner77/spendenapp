'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  
  // Deadline: December 31, 2025, 23:59:59
  const deadline = new Date('2025-12-31T23:59:59');

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="countdown-box rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[60px] md:min-w-[80px]">
        <span className="countdown-number text-2xl md:text-3xl font-bold text-white">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-gray-500 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="text-realcore-gold" size={20} />
        <span className="text-sm font-medium text-gray-700">{t('countdown.deadline')}</span>
      </div>
      
      <div className="flex justify-center items-center gap-2 md:gap-4">
        <TimeBox value={timeLeft.days} label={t('countdown.days')} />
        <span className="text-2xl font-bold text-realcore-gold mt-[-20px]">:</span>
        <TimeBox value={timeLeft.hours} label={t('countdown.hours')} />
        <span className="text-2xl font-bold text-realcore-gold mt-[-20px]">:</span>
        <TimeBox value={timeLeft.minutes} label={t('countdown.minutes')} />
        <span className="text-2xl font-bold text-realcore-gold mt-[-20px] hidden sm:block">:</span>
        <div className="hidden sm:block">
          <TimeBox value={timeLeft.seconds} label={t('countdown.seconds')} />
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-3">
        {t('countdown.participateNow')}
      </p>
    </div>
  );
}
