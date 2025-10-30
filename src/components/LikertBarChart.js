import React, { useEffect, useState } from 'react';
import { readCSVFile } from '../utils/csvReader';

const HUE_ORDER = [30, 45, 60, 75, 135, 180, 195, 240, 270, 285, 315, 345];
const HUE_LABELS = {
  30: 'Orange', 45: 'Yellow-Orange', 60: 'Yellow', 75: 'Lime Green',
  135: 'Green', 180: 'Cyan', 195: 'Blue', 240: 'Purple',
  270: 'Dark Purple', 285: 'Magenta', 315: 'Pink', 345: 'Red'
};
const HUE_COLORS = {
  30: 'hsl(30, 100%, 50%)', 45: 'hsl(45, 100%, 50%)', 60: 'hsl(60, 100%, 50%)', 75: 'hsl(75, 100%, 50%)',
  135: 'hsl(135, 100%, 50%)', 180: 'hsl(180, 100%, 50%)', 195: 'hsl(195, 100%, 50%)', 240: 'hsl(240, 100%, 50%)',
  270: 'hsl(270, 100%, 50%)', 285: 'hsl(285, 100%, 50%)', 315: 'hsl(315, 100%, 50%)', 345: 'hsl(345, 100%, 50%)'
};
const SCORE_COLORS = ['#e74c3c', '#f1948a', '#b2b2b2', '#d4efdf', '#82e0aa'];
const SORT_OPTIONS = [
  { value: 'hue', label: 'Sort by Hue (ascending)' },
  { value: 'score', label: 'Sort by Mean Score (descending)' }
];

function processLikertData(rows) {
  // Remove any summary/empty rows
  const filtered = rows.filter(r => r['user id'] && r['user id'].trim() !== '' && !r['user id'].toLowerCase().startsWith('mean'));
  const hues = Object.keys(rows[0]).filter(h => h.startsWith('hue'));
  const hueData = {};
  for (const hue of hues) {
    const hueNum = parseInt(hue.replace('hue ', ''));
    const counts = [0, 0, 0, 0, 0]; // 1-5
    let sum = 0;
    for (const row of filtered) {
      const score = parseInt(row[hue]);
      if (score >= 1 && score <= 5) {
        counts[score - 1]++;
        sum += score;
      }
    }
    const total = counts.reduce((a, b) => a + b, 0);
    hueData[hueNum] = {
      dist: total > 0 ? counts.map(c => c / total) : [0,0,0,0,0],
      mean: total > 0 ? sum / total : null
    };
  }
  return hueData;
}

const LikertBarChart = () => {
  const [clarity, setClarity] = useState(null);
  const [comfort, setComfort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState('hue');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const clearRows = await readCSVFile('color_rank_likert_clear.csv');
      const comfortRows = await readCSVFile('color_rank_likert_comfort.csv');
      setClarity(processLikertData(clearRows));
      setComfort(processLikertData(comfortRows));
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !clarity || !comfort) return <div className="card"><p>Loading Likert results...</p></div>;

  // 100% bar width for reference
  const barWidthPx = 240;

  // Sorting logic
  function getSortedHues(data) {
    if (sortMode === 'hue') {
      return [...HUE_ORDER];
    } else {
      // score: sort by mean descending
      return [...HUE_ORDER].sort((a, b) => {
        const ma = data[a]?.mean ?? -Infinity;
        const mb = data[b]?.mean ?? -Infinity;
        return mb - ma;
      });
    }
  }

  return (
    <div className="card" style={{ marginTop: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Overall Rankings of Various Hue (Likert)</h3>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>Sort:</span>
        <select value={sortMode} onChange={e => setSortMode(e.target.value)} style={{ fontSize: 14, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}>
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {[['Clarity', clarity], ['Comfort', comfort]].map(([label, data], idx) => {
          const sortedHues = getSortedHues(data);
          return (
            <div key={label} style={{ flex: 1, minWidth: 320 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sortedHues.map(hue => {
                  const d = data[hue]?.dist || [0,0,0,0,0];
                  const mean = data[hue]?.mean;
                  const meanPos = mean ? ((mean - 1) / 4) * barWidthPx : null;
                  return (
                    <div key={hue} style={{ display: 'flex', alignItems: 'center', height: 28, position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', minWidth: 60, marginRight: 12 }}>
                        <div style={{ width: 32, textAlign: 'right', fontSize: 13, paddingRight: 4 }}>{hue}</div>
                        <span style={{ display: 'inline-block', width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16, borderRadius: '50%', background: HUE_COLORS[hue], marginLeft: 0, marginRight: 0, boxSizing: 'border-box', flex: 'none' }} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', height: 18, borderRadius: 4, overflow: 'hidden', border: '1px solid #eee', minWidth: barWidthPx, maxWidth: barWidthPx, position: 'relative', background: '#fff' }}>
                        {d.map((pct, i) => (
                          <div key={i} style={{ width: `${pct * 100}%`, background: SCORE_COLORS[i], height: '100%' }} title={`Score ${i+1}: ${(pct*100).toFixed(1)}%`} />
                        ))}
                        {/* Dashed mean line */}
                        {meanPos !== null && (
                          <div style={{
                            position: 'absolute',
                            left: meanPos,
                            top: 0,
                            bottom: 0,
                            width: 0,
                            borderLeft: '2px dashed #333',
                            zIndex: 2
                          }} title={`Mean: ${mean.toFixed(2)}`}></div>
                        )}
                      </div>
                      {/* Display mean value */}
                      {mean && (
                        <span style={{ fontSize: 12, color: '#333', marginLeft: 8, minWidth: 36, textAlign: 'left' }}>{mean.toFixed(2)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {SCORE_COLORS.map((color, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 14, background: color, borderRadius: 3, border: '1px solid #ccc' }} />
            <span style={{ fontSize: 13 }}>Scores {i+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikertBarChart; 