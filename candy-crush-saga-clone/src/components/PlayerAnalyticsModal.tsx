import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PlayerProgress } from '../types';
import { getLevelConfig, LEVELS } from '../utils/levels';
import { X, TrendingUp, Award, Star, BarChart2, Zap, Trophy, Shield, Crown } from 'lucide-react';
import { sound } from '../utils/sound';
import { ALL_PROFILE_BADGES } from '../utils/weeklyChallenges';

interface PlayerAnalyticsModalProps {
  progress: PlayerProgress;
  onClose: () => void;
}

interface LevelDataPoint {
  levelId: number;
  levelName: string;
  worldName: string;
  score: number;
  stars: number;
  target1Star: number;
  target3Star: number;
  pctOfTarget: number;
}

export const PlayerAnalyticsModal: React.FC<PlayerAnalyticsModalProps> = ({ progress, onClose }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [metricView, setMetricView] = useState<'score' | 'stars'>('score');
  const [hoveredData, setHoveredData] = useState<LevelDataPoint | null>(null);

  // Determine the 10 levels range to display (ending at unlockedLevel or current max)
  const maxLvl = Math.max(1, Math.min(progress.unlockedLevel, LEVELS.length));
  const startLvl = Math.max(1, maxLvl - 9);
  const endLvl = Math.min(LEVELS.length, startLvl + 9);

  const levelDataPoints: LevelDataPoint[] = [];
  for (let id = startLvl; id <= endLvl; id++) {
    const config = getLevelConfig(id);
    const score = progress.highScores[id] || 0;
    const stars = progress.stars[id] || 0;
    const target1Star = config.starScores[0];
    const target3Star = config.starScores[2];
    const pctOfTarget = Math.round((score / target3Star) * 100);

    levelDataPoints.push({
      levelId: id,
      levelName: config.name,
      worldName: config.worldName,
      score,
      stars,
      target1Star,
      target3Star,
      pctOfTarget,
    });
  }

  // Summary Metrics
  const totalScoreInRange = levelDataPoints.reduce((acc, d) => acc + d.score, 0);
  const avgScore = Math.round(totalScoreInRange / levelDataPoints.length);
  const totalStarsInRange = levelDataPoints.reduce((acc, d) => acc + d.stars, 0);
  const maxPossibleStars = levelDataPoints.length * 3;
  const threeStarCount = levelDataPoints.filter((d) => d.stars === 3).length;

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const containerWidth = svgRef.current.clientWidth || 440;
    const containerHeight = 240;
    const margin = { top: 35, right: 20, bottom: 45, left: 55 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradients setup
    const defs = svg.append('defs');

    // 3 Stars Gold Gradient
    const goldGrad = defs.append('linearGradient').attr('id', 'gold-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    goldGrad.append('stop').attr('offset', '0%').attr('stop-color', '#FBBF24');
    goldGrad.append('stop').attr('offset', '100%').attr('stop-color', '#D97706');

    // 2 Stars Silver Gradient
    const silverGrad = defs.append('linearGradient').attr('id', 'silver-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    silverGrad.append('stop').attr('offset', '0%').attr('stop-color', '#E2E8F0');
    silverGrad.append('stop').attr('offset', '100%').attr('stop-color', '#64748B');

    // 1 Star Bronze Gradient
    const bronzeGrad = defs.append('linearGradient').attr('id', 'bronze-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    bronzeGrad.append('stop').attr('offset', '0%').attr('stop-color', '#F97316');
    bronzeGrad.append('stop').attr('offset', '100%').attr('stop-color', '#9A3412');

    // 0 Stars Default Gradient
    const defaultGrad = defs.append('linearGradient').attr('id', 'default-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    defaultGrad.append('stop').attr('offset', '0%').attr('stop-color', '#A855F7');
    defaultGrad.append('stop').attr('offset', '100%').attr('stop-color', '#581C87');

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(levelDataPoints.map((d) => `L${d.levelId}`))
      .range([0, width])
      .padding(0.28);

    const maxYValue =
      metricView === 'score'
        ? Math.max(d3.max(levelDataPoints, (d) => Math.max(d.score, d.target3Star)) || 1000, 1000)
        : 3;

    const yScale = d3.scaleLinear().domain([0, maxYValue]).nice().range([height, 0]);

    // Gridlines (Y-axis)
    const yGrid = d3.axisLeft(yScale).ticks(4).tickSize(-width).tickFormat(() => '');
    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-dasharray', '3,3');

    // X Axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#CBD5E1')
      .attr('font-size', '11px')
      .attr('font-weight', '700');

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(4).tickFormat((d) => {
      if (metricView === 'stars') return `${d}⭐`;
      const val = d as number;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
      return `${val}`;
    });

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')
      .attr('font-weight', '600');

    // Remove domain axis lines
    g.selectAll('.domain').attr('stroke', 'rgba(255, 255, 255, 0.2)');

    // Bars
    g.selectAll('.bar')
      .data(levelDataPoints)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(`L${d.levelId}`) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', (d) => {
        if (metricView === 'stars') {
          if (d.stars === 3) return 'url(#gold-grad)';
          if (d.stars === 2) return 'url(#silver-grad)';
          if (d.stars === 1) return 'url(#bronze-grad)';
          return 'url(#default-grad)';
        }
        if (d.stars === 3) return 'url(#gold-grad)';
        if (d.stars === 2) return 'url(#silver-grad)';
        if (d.stars === 1) return 'url(#bronze-grad)';
        return 'url(#default-grad)';
      })
      .attr('cursor', 'pointer')
      .on('mouseenter', (_event, d) => {
        sound.playPop();
        setHoveredData(d);
      })
      .on('mouseleave', () => {
        setHoveredData(null);
      })
      .transition()
      .duration(700)
      .delay((_d, i) => i * 40)
      .attr('y', (d) => {
        const val = metricView === 'score' ? d.score : d.stars;
        return yScale(val);
      })
      .attr('height', (d) => {
        const val = metricView === 'score' ? d.score : d.stars;
        return Math.max(0, height - yScale(val));
      });

    // Top Stars Badges or Labels on top of Bars
    g.selectAll('.bar-label')
      .data(levelDataPoints)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => (xScale(`L${d.levelId}`) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => {
        const val = metricView === 'score' ? d.score : d.stars;
        return yScale(val) - 6;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#FDE047')
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .text((d) => {
        if (d.stars === 0) return '';
        return '⭐'.repeat(d.stars);
      });

  }, [levelDataPoints, metricView]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#24133B] border-2 border-purple-400/40 rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 font-black">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-200 tracking-wide flex items-center gap-1.5">
                PLAYER ANALYTICS
              </h2>
              <p className="text-xs text-purple-300/80 font-medium">
                D3 Trend Chart • Levels {startLvl}–{endLvl}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Equipped Badge Tag */}
        {(() => {
          const equippedId = progress.weeklyChallenges?.equippedBadgeId;
          const badge = equippedId ? ALL_PROFILE_BADGES[equippedId] : null;
          return (
            <div className="mt-2.5 bg-slate-900/80 border border-amber-400/30 rounded-2xl p-2 px-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">{badge ? badge.icon : '🛡️'}</span>
                <div>
                  <span className="text-[9px] uppercase font-bold text-amber-300 block">
                    EQUIPPED TITLE & BADGE
                  </span>
                  <span className="font-extrabold text-white">
                    {badge ? badge.name : 'No Badge Equipped'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-purple-300/80 bg-purple-900/60 px-2 py-1 rounded-xl border border-purple-400/30 font-mono font-bold">
                {progress.weeklyChallenges?.unlockedBadgeIds?.length || 0} Badges Unlocked
              </span>
            </div>
          );
        })()}

        {/* Metric Selector Tabs */}
        <div className="flex items-center justify-between my-3 gap-2">
          <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                sound.playPop();
                setMetricView('score');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                metricView === 'score'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              High Scores
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setMetricView('stars');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                metricView === 'stars'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-slate-950" />
              Stars Earned
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-purple-300/70 uppercase font-black tracking-wider block">
              10-Level Avg
            </span>
            <span className="text-sm font-black text-amber-300 font-mono">
              {avgScore.toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-3 gap-2 my-1">
          <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Total Score
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
              {totalScoreInRange.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Stars Collected
            </span>
            <span className="text-xs sm:text-sm font-black text-yellow-300">
              {totalStarsInRange} / {maxPossibleStars} ⭐
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              3-Star Levels
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-400">
              {threeStarCount} / {levelDataPoints.length} 🏆
            </span>
          </div>
        </div>

        {/* D3 SVG Container */}
        <div className="relative my-2 p-2 bg-slate-950/70 rounded-2xl border border-purple-500/20 shadow-inner">
          <svg ref={svgRef} className="w-full h-[240px]" />

          {/* Interactive Hover Card Overlay */}
          {hoveredData ? (
            <div className="absolute top-3 right-3 bg-slate-900/95 border border-amber-400/50 p-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs animate-in fade-in duration-150 max-w-[200px]">
              <div className="font-extrabold text-amber-300 flex items-center justify-between gap-1">
                <span>L{hoveredData.levelId}: {hoveredData.levelName}</span>
                <span>{'⭐'.repeat(hoveredData.stars)}</span>
              </div>
              <div className="text-[10px] text-purple-200/70 font-semibold mb-1">
                {hoveredData.worldName}
              </div>
              <div className="text-white font-mono font-bold">
                Score: {hoveredData.score.toLocaleString()} pts
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Target 3-Star: {hoveredData.target3Star.toLocaleString()} ({hoveredData.pctOfTarget}%)
              </div>
            </div>
          ) : (
            <div className="absolute top-2 right-3 text-[10px] text-slate-400 font-medium italic pointer-events-none">
              Hover over bars to inspect level details
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-2 text-center text-[11px] text-purple-200/70 font-medium">
          💡 Visualized with D3.js. High score trends dynamically update as you complete levels!
        </div>
      </div>
    </div>
  );
};
