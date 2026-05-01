'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── HARDCODED APPLICANTS ────────────────────────────────────
const CHALLENGERS = [
  { name: 'Marcus Chen', title: 'Staff Engineer', company: 'Stripe', initials: 'MC', color: '#6366f1' },
  { name: 'Priya Sharma', title: 'Lead PM', company: 'Meta', initials: 'PS', color: '#ec4899' },
  { name: 'Jake Williams', title: 'Senior SWE', company: 'Google', initials: 'JW', color: '#f59e0b' },
  { name: 'Aisha Okonkwo', title: 'ML Engineer', company: 'OpenAI', initials: 'AO', color: '#10b981' },
  { name: 'David Kim', title: 'Tech Lead', company: 'Apple', initials: 'DK', color: '#8b5cf6' },
  { name: 'Elena Volkov', title: 'Eng Manager', company: 'Netflix', initials: 'EV', color: '#ef4444' },
  { name: 'Tomás Rivera', title: 'Principal SWE', company: 'Amazon', initials: 'TR', color: '#06b6d4' },
];

const ELIMINATION_MESSAGES = [
  'couldn\'t handle the pressure.',
  'has been voted off the island.',
  'folded under interrogation.',
  'rage-quit the process.',
  'got a competing offer and left.',
  'failed the vibe check.',
  'was caught padding their resume.',
];

const VICTORY_LINES = [
  'You wanted it more. The offer is yours.',
  'Last one standing. Congratulations, you\'re hired.',
  'Pure determination. Welcome aboard.',
];

interface Applicant {
  name: string;
  title: string;
  company: string;
  initials: string;
  color: string;
  isUser?: boolean;
}

interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnterpriseModal({ isOpen, onClose }: EnterpriseModalProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState(300); // 5:00
  const [currentElimination, setCurrentElimination] = useState<number | null>(null);
  const [eliminationMessage, setEliminationMessage] = useState('');
  const [isVictory, setIsVictory] = useState(false);
  const [round, setRound] = useState(0);
  const [victoryLine, setVictoryLine] = useState('');

  // ── INIT ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const userApplicant: Applicant = {
        name: 'You',
        title: 'The Hungriest',
        company: 'Unemployed (for now)',
        initials: 'U',
        color: '#3b82f6',
        isUser: true,
      };
      // Shuffle challengers and pick 7, insert user at random position
      const shuffled = [...CHALLENGERS].sort(() => Math.random() - 0.5);
      const pool = shuffled.slice(0, 7);
      const insertIdx = Math.floor(Math.random() * (pool.length + 1));
      pool.splice(insertIdx, 0, userApplicant);
      setApplicants(pool);
      setEliminated(new Set());
      setTimer(300);
      setCurrentElimination(null);
      setEliminationMessage('');
      setIsVictory(false);
      setRound(0);
    }
  }, [isOpen]);

  // ── TIMER ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || isVictory) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isVictory]);

  // ── ELIMINATION ENGINE ────────────────────────────────────
  const eliminate = useCallback(() => {
    if (isVictory) return;

    const alive = applicants
      .map((a, i) => ({ ...a, idx: i }))
      .filter(a => !eliminated.has(a.idx) && !a.isUser);

    if (alive.length === 0) {
      setIsVictory(true);
      return;
    }

    const target = alive[Math.floor(Math.random() * alive.length)];
    const msg = ELIMINATION_MESSAGES[Math.floor(Math.random() * ELIMINATION_MESSAGES.length)];

    setCurrentElimination(target.idx);
    setEliminationMessage(`${target.name} ${msg}`);
    setRound(prev => prev + 1);

    setTimeout(() => {
      setEliminated(prev => new Set([...prev, target.idx]));
      setCurrentElimination(null);

      // Check if user is now the last one
      const remainingAfter = applicants.filter(
        (a, i) => !eliminated.has(i) && i !== target.idx && !a.isUser
      );
      if (remainingAfter.length === 0) {
        setTimeout(() => {
          setVictoryLine(VICTORY_LINES[Math.floor(Math.random() * VICTORY_LINES.length)]);
          setIsVictory(true);
        }, 800);
      }
    }, 1500);
  }, [applicants, eliminated, isVictory]);

  // Auto-eliminate every 3.5s
  useEffect(() => {
    if (!isOpen || applicants.length === 0 || isVictory) return;

    // First elimination after 2.5s, then every 3.5s
    const delay = round === 0 ? 2500 : 3500;
    const timeout = setTimeout(eliminate, delay);
    return () => clearTimeout(timeout);
  }, [isOpen, applicants, eliminated, round, isVictory, eliminate]);

  // ── ESC TO CLOSE ──────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // ── FORMAT TIME ───────────────────────────────────────────
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const aliveCount = applicants.filter((_, i) => !eliminated.has(i)).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0a12]/90 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] p-8 md:p-12"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                ENTERPRISE MODE
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-3xl md:text-5xl font-bold text-white mb-3"
              >
                Battle Round
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/40 text-sm font-mono"
              >
                Last one standing gets the offer. Who wants it more?
              </motion.p>
            </div>

            {/* Stats bar */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-white/50 font-mono">
                  <span className="text-white font-bold">{aliveCount}</span> / {applicants.length} alive
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="text-sm font-mono text-white/50">
                <span className="text-white font-bold">{fmt(timer)}</span> remaining
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="text-sm font-mono text-white/50">
                Round <span className="text-white font-bold">{round}</span>
              </div>
            </div>

            {/* Elimination feed */}
            <AnimatePresence mode="wait">
              {currentElimination !== null && (
                <motion.div
                  key={`elim-${currentElimination}`}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="text-center mb-6"
                >
                  <span className="inline-block px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                    💀 {eliminationMessage}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Applicant Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {applicants.map((applicant, i) => {
                const isDead = eliminated.has(i);
                const isBeingEliminated = currentElimination === i;
                const isUser = applicant.isUser;

                return (
                  <motion.div
                    key={`${applicant.name}-${i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isDead ? 0.2 : 1,
                      scale: isDead ? 0.9 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`relative rounded-2xl border p-5 flex flex-col items-center gap-3 transition-all duration-300 ${
                      isBeingEliminated
                        ? 'border-red-500/60 bg-red-500/10 animate-eliminate'
                        : isDead
                          ? 'border-white/5 bg-white/[0.02] grayscale'
                          : isUser
                            ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                            : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    {/* Status indicator */}
                    {!isDead && !isBeingEliminated && (
                      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                        isUser ? 'bg-blue-500' : 'bg-green-500'
                      } animate-pulse`} />
                    )}
                    {isDead && (
                      <div className="absolute top-3 right-3 text-red-500/60 text-xs font-mono">
                        OUT
                      </div>
                    )}

                    {/* Avatar */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        isDead ? 'opacity-30' : ''
                      }`}
                      style={{
                        backgroundColor: isDead ? '#333' : `${applicant.color}20`,
                        color: isDead ? '#666' : applicant.color,
                        border: `2px solid ${isDead ? '#333' : applicant.color}40`,
                      }}
                    >
                      {applicant.initials}
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <p className={`font-bold text-sm ${
                        isDead ? 'text-white/20 line-through' : isUser ? 'text-blue-400' : 'text-white'
                      }`}>
                        {applicant.name}
                        {isUser && !isDead && (
                          <span className="ml-1 text-[10px] text-blue-400/80 font-mono">(you)</span>
                        )}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDead ? 'text-white/10' : 'text-white/40'}`}>
                        {applicant.title}
                      </p>
                      <p className={`text-[10px] font-mono mt-0.5 ${isDead ? 'text-white/10' : 'text-white/25'}`}>
                        {applicant.company}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Victory overlay */}
            <AnimatePresence>
              {isVictory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-3xl z-20"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                    className="text-7xl mb-6"
                  >
                    👑
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-heading text-3xl md:text-5xl font-bold text-white mb-3 text-center px-8"
                  >
                    You got the job.
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-white/50 text-sm font-mono text-center max-w-md px-4"
                  >
                    {victoryLine}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    onClick={onClose}
                    className="mt-8 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors cursor-pointer shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                  >
                    Accept Offer
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <p className="text-center text-[10px] text-white/20 font-mono mt-8">
              SlimedOut Enterprise™ — This is not a real hiring process. Probably.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
