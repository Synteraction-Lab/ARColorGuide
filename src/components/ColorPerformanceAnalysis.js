import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPerformanceData } from '../utils/csvReader';
import { Star, Gem } from 'lucide-react';
import LikertBarChart from './LikertBarChart';

const DEVICE_OPTIONS = [
  { key: 'Xreal', label: 'Xreal' },
  { key: 'hololens', label: 'HoloLens' }
];
const ENV_OPTIONS = [
  { key: 'indoor', label: 'Indoor' },
  { key: 'outdoor', label: 'Outdoor' }
];

// Colors matching Python code exactly
const deviceColors = {
  'hololens-indoor': '#1f77b4',    // Blue circle
  'hololens-outdoor': '#ff7f0e',   // Orange square  
  'Xreal-indoor': '#2ca02c',       // Green triangle
  'Xreal-outdoor': '#d62728'       // Red inverted triangle
};

const ColorPerformanceAnalysis = () => {
  const [selectedDevices, setSelectedDevices] = useState(['Xreal']);
  const [selectedEnvironments, setSelectedEnvironments] = useState(['indoor']);
  const [selectedHue, setSelectedHue] = useState(30);
  const [variationType, setVariationType] = useState('saturation');
  const [performanceData, setPerformanceData] = useState({}); // { 'device-env': [data] }
  const [chartData, setChartData] = useState([]); // FIXED: Combined chart data
  const [loading, setLoading] = useState(false);
  const [showClarity, setShowClarity] = useState(true);
  const [showComfort, setShowComfort] = useState(true);

  // Convert HSV to RGB (matching Python colorsys.hsv_to_rgb exactly)
  const hsvToRgb = (h, s, v) => {
    h = h / 360;  // Convert degrees to 0-1
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    
    let r, g, b;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default: r = g = b = 0;
    }
    
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  // Sample data based on your research results
  const hueData = {
    30: { name: 'Orange', color: 'hsl(30, 100%, 50%)' },      
    45: { name: 'Yellow-Orange', color: 'hsl(45, 100%, 50%)' }, 
    60: { name: 'Yellow', color: 'hsl(60, 100%, 50%)' },        
    75: { name: 'Lime Green', color: 'hsl(75, 100%, 50%)' },    
    135: { name: 'Green', color: 'hsl(135, 100%, 50%)' },       
    180: { name: 'Cyan', color: 'hsl(180, 100%, 50%)' },        
    195: { name: 'Blue', color: 'hsl(195, 100%, 50%)' },        
    240: { name: 'Purple', color: 'hsl(240, 100%, 50%)' },      
    270: { name: 'Dark Purple', color: 'hsl(270, 100%, 50%)' }, 
    285: { name: 'Magenta', color: 'hsl(285, 100%, 50%)' },     
    315: { name: 'Pink', color: 'hsl(315, 100%, 50%)' },  
    345: { name: 'Red', color: 'hsl(345, 100%, 50%)' } 
  };

  // Multi-select toggle functions
  const toggleDevice = (key) => {
    setSelectedDevices(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  };
  const toggleEnvironment = (key) => {
    setSelectedEnvironments(prev => prev.includes(key) ? prev.filter(e => e !== key) : [...prev, key]);
  };

  // FIXED: Load and combine data for chart
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const newData = {};
      try {
        console.log('Loading data for:', { selectedHue, selectedDevices, selectedEnvironments, variationType });
        
        for (const device of selectedDevices) {
          for (const env of selectedEnvironments) {
            const key = `${device}-${env}`;
            console.log(`Loading data for ${key}...`);
            
            const data = await getPerformanceData(selectedHue, device, env, 'control', variationType);
            newData[key] = data || [];
            
            console.log(`Loaded ${(data || []).length} data points for ${key}`);
          }
        }
        
        setPerformanceData(newData);
        
        // FIXED: Create combined chart data
        const allValues = new Set();
        Object.values(newData).forEach(dataArray => {
          dataArray.forEach(point => allValues.add(point.value));
        });
        
        const sortedValues = [...allValues].sort((a, b) => a - b);
        console.log('All values found:', sortedValues);
        
        const combinedData = sortedValues.map(value => {
          const dataPoint = { value };
          
          // Add data for each device-environment combination
          Object.entries(newData).forEach(([key, dataArray]) => {
            const point = dataArray.find(p => p.value === value);
            if (point) {
              dataPoint[`${key}-clarity`] = point.clarity;
              dataPoint[`${key}-comfort`] = point.comfort;
            }
          });
          
          return dataPoint;
        });
        
        console.log('Combined chart data:', combinedData);
        setChartData(combinedData);
        
      } catch (error) {
        console.error('Error loading performance data:', error);
        setPerformanceData({});
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [selectedHue, selectedDevices, selectedEnvironments, variationType]);

  // Find peak points for analysis - EXACTLY like Python code
  const findPeaks = () => {
    const allClarityPeaks = [];
    const allComfortPeaks = [];
    const peakDetails = {}; // Store peak details for each device-env combination
    
    Object.entries(performanceData).forEach(([key, dataArray]) => {
      if (dataArray.length > 0) {
        // Find single maximum clarity score and its value (exactly like Python)
        const clarityMax = Math.max(...dataArray.map(p => p.clarity));
        const clarityPeakPoint = dataArray.find(p => p.clarity === clarityMax);
        
        // Find single maximum comfort score and its value (exactly like Python)  
        const comfortMax = Math.max(...dataArray.map(p => p.comfort));
        const comfortPeakPoint = dataArray.find(p => p.comfort === comfortMax);
        
        peakDetails[key] = {
          clarityPeak: clarityPeakPoint,
          comfortPeak: comfortPeakPoint
        };
        
        if (clarityPeakPoint) allClarityPeaks.push(clarityPeakPoint.value);
        if (comfortPeakPoint) allComfortPeaks.push(comfortPeakPoint.value);
      }
    });
    
    return {
      clarityRange: allClarityPeaks.length > 0 ? 
        `${Math.min(...allClarityPeaks)}-${Math.max(...allClarityPeaks)}%` : 'N/A',
      comfortRange: allComfortPeaks.length > 0 ? 
        `${Math.min(...allComfortPeaks)}-${Math.max(...allComfortPeaks)}%` : 'N/A',
      peakDetails: peakDetails
    };
  };

  const peaks = findPeaks();

  return (
    <div className="color-performance-analysis">
      <div className="card">
        <h2>Color Performance Analysis</h2>
        <p className="description">
          Explore how different colors perform across various AR devices and environmental conditions. 
          This analysis shows clarity and comfort scores for different hue, saturation, and brightness combinations.
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="controls">
          {/* Variation Type */}
          <div className="controls-row">
            <div className="control-group">
              <label>Variation Type:</label>
              <div className="button-group">
                <button 
                  className={`btn ${variationType === 'saturation' ? 'active' : 'btn-secondary'}`}
                  onClick={() => setVariationType('saturation')}
                >
                  Saturation (Brightness = 100%)
                </button>
                <button 
                  className={`btn ${variationType === 'brightness' ? 'active' : 'btn-secondary'}`}
                  onClick={() => setVariationType('brightness')}
                >
                  Brightness (Saturation = 100%)
                </button>
              </div>
            </div>
          </div>
          
          {/* Device & Environment */}
          <div className="controls-row">
            <div className="control-group">
              <label>Device:</label>
              <div className="button-group">
                {DEVICE_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`btn ${selectedDevices.includes(opt.key) ? 'active' : 'btn-secondary'}`}
                    onClick={() => toggleDevice(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label>Environment:</label>
              <div className="button-group">
                {ENV_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`btn ${selectedEnvironments.includes(opt.key) ? 'active' : 'btn-secondary'}`}
                    onClick={() => toggleEnvironment(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Hue Selection - CONTINUOUS COLOR BAND */}
          <div className="control-group">
            <label>Hue Selection:</label>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '700px',
              height: '60px',
              background: 'linear-gradient(to right, #ff0000 0%, #ffff00 16.67%, #00ff00 33.33%, #00ffff 50%, #0000ff 66.67%, #ff00ff 83.33%, #ff0000 100%)',
              borderRadius: '30px',
              border: '2px solid #e0e0e0',
              overflow: 'hidden',
              margin: '8px 0'
            }}>
              {/* Available hue markers */}
              {Object.entries(hueData).map(([hue, info]) => {
                const hueNumber = parseInt(hue);
                const position = (hueNumber / 360) * 100; // Convert hue to percentage position
                const isSelected = selectedHue === hueNumber;
                
                return (
                  <button
                    key={hue}
                    onClick={() => setSelectedHue(hueNumber)}
                    style={{
                      position: 'absolute',
                      left: `${position}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: isSelected ? '32px' : '24px',
                      height: isSelected ? '32px' : '24px',
                      borderRadius: '50%',
                      border: isSelected ? '3px solid #333' : '2px solid #fff',
                      background: info.color,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: isSelected ? 10 : 5,
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isSelected ? '10px' : '8px',
                      fontWeight: 'bold',
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                    title={`${info.name} (${hue}°)`}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.transform = 'translate(-50%, -50%) scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                      }
                    }}
                  >
                    {hue}
                  </button>
                );
              })}
              
              {/* Selected hue indicator line */}
              <div
                style={{
                  position: 'absolute',
                  left: `${(selectedHue / 360) * 100}%`,
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  background: '#333',
                  transform: 'translateX(-50%)',
                  zIndex: 15,
                  pointerEvents: 'none'
                }}
              />
            </div>
            
            {/* Selected hue info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: hueData[selectedHue].color,
                  border: '1px solid #ccc'
                }}
              />
              <span>
                <strong>{hueData[selectedHue].name}</strong> ({selectedHue}°)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card">
        <h3>Performance Analysis: {hueData[selectedHue].name} (Hue {selectedHue})</h3>
        <p className="chart-description">
          {selectedDevices.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(' & ')} - {selectedEnvironments.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' & ')} Environment - {variationType.charAt(0).toUpperCase() + variationType.slice(1)} Variation
        </p>
        
        {/* Peak Information - MODERN FLAT DESIGN, now as toggle buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={() => {
              // Toggle clarity, if both off, turn both on
              if (showClarity && !showComfort) {
                setShowClarity(false); setShowComfort(true);
              } else if (!showClarity && !showComfort) {
                setShowClarity(true);
              } else {
                setShowClarity(v => !v);
              }
            }}
            style={{
              background: '#ffd700',
              padding: '12px 20px',
              borderRadius: '8px',
              color: '#333',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '160px',
              justifyContent: 'center',
              border: showClarity ? '2px solid #333' : '2px solid transparent',
              boxShadow: showClarity ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              opacity: showClarity ? 1 : 0.5,
              transition: 'all 0.2s'
            }}
          >
            <Star size={18} color="#ffffff" style={{ marginRight: 4 }} />
            <span>Clarity: {peaks.clarityRange}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              // Toggle comfort, if both off, turn both on
              if (!showClarity && showComfort) {
                setShowComfort(false); setShowClarity(true);
              } else if (!showClarity && !showComfort) {
                setShowComfort(true);
              } else {
                setShowComfort(v => !v);
              }
            }}
            style={{
              background: '#87ceeb',
              padding: '12px 20px',
              borderRadius: '8px',
              color: '#333',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '160px',
              justifyContent: 'center',
              border: showComfort ? '2px solid #333' : '2px solid transparent',
              boxShadow: showComfort ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              opacity: showComfort ? 1 : 0.5,
              transition: 'all 0.2s'
            }}
          >
            <Gem size={18} color="#ffffff" style={{ marginRight: 4 }} />
            <span>Comfort: {peaks.comfortRange}</span>
          </button>
        </div>
        
        <div className="chart-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading performance data...</p>
            </div>
          ) : chartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="value" 
                    label={{ value: `${variationType.charAt(0).toUpperCase() + variationType.slice(1)} (%)`, position: 'insideBottom', offset: -10 }}
                    domain={[20, 100]}
                  />
                  <YAxis 
                    label={{ value: 'Score of Selections', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [value, name]}
                    labelFormatter={(label) => `${label}%`}
                  />
                  <Legend 
                    content={({ payload }) => (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 5,
                        marginTop: 16,
                        fontSize: 18,
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                        {payload.map((entry, index) => {
                          const isClarity = entry.value.toLowerCase().includes('clarity');
                          return (
                            <span key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <svg width="36" height="18" style={{ marginRight: 4 }}>
                                <line
                                  x1="2" y1="9" x2="28" y2="9"
                                  stroke={entry.color}
                                  strokeWidth={isClarity ? 4 : 3}
                                  strokeDasharray={isClarity ? '' : '8 4'}
                                />
                                <circle
                                  cx="32" cy="9" r="6"
                                  fill={entry.color}
                                  stroke="#fff"
                                  strokeWidth="1"
                                />
                              </svg>
                              {entry.value}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  />
                  
                  {/* Generate lines for each device-environment combination */}
                  {Object.keys(performanceData).map(key => {
                    const [device, env] = key.split('-');
                    const color = deviceColors[key] || '#888';
                    
                    const lines = [];
                    if (showClarity || (!showClarity && !showComfort)) {
                      lines.push(
                        <Line
                          key={`${key}-clarity`}
                          type="monotone"
                          dataKey={`${key}-clarity`}
                          stroke={color}
                          strokeWidth={4}
                          strokeDasharray=""
                          name={`${device} ${env} Clarity`}
                          dot={(props) => {
                            const clarityPeak = peaks.peakDetails[key]?.clarityPeak;
                            if (clarityPeak && props.payload?.value === clarityPeak.value) {
                              return (
                                <g>
                                  <circle cx={props.cx} cy={props.cy} r={6} fill={color} stroke="#fff" strokeWidth={2} />
                                  <foreignObject x={props.cx - 9} y={props.cy - 28} width={18} height={18} style={{ pointerEvents: 'none' }}>
                                    <Star size={18} color="#ffd700" />
                                  </foreignObject>
                                  <text 
                                    x={props.cx + 8} 
                                    y={props.cy + 12} 
                                    textAnchor="start" 
                                    fontSize="10" 
                                    fontWeight="bold"
                                    fill="black"
                                    style={{ background: 'rgba(255,215,0,0.8)' }}
                                  >
                                    {props.payload?.value}%
                                  </text>
                                </g>
                              );
                            }
                            return <circle cx={props.cx} cy={props.cy} r={5} fill={color} stroke="#fff" strokeWidth={1} />;
                          }}
                          connectNulls
                        />
                      );
                    }
                    if (showComfort || (!showClarity && !showComfort)) {
                      lines.push(
                        <Line
                          key={`${key}-comfort`}
                          type="monotone"
                          dataKey={`${key}-comfort`}
                          stroke={color}
                          strokeWidth={3}
                          strokeDasharray="8 4"
                          name={`${device} ${env} Comfort`}
                          dot={(props) => {
                            const comfortPeak = peaks.peakDetails[key]?.comfortPeak;
                            if (comfortPeak && props.payload?.value === comfortPeak.value) {
                              return (
                                <g>
                                  <circle cx={props.cx} cy={props.cy} r={4} fill="#fff" stroke={color} strokeWidth={2} />
                                  <foreignObject x={props.cx - 8} y={props.cy - 26} width={16} height={16} style={{ pointerEvents: 'none' }}>
                                    <Gem size={16} color="#87ceeb" />
                                  </foreignObject>
                                  <text 
                                    x={props.cx + 8} 
                                    y={props.cy - 12} 
                                    textAnchor="start" 
                                    fontSize="10" 
                                    fontWeight="bold"
                                    fill="black"
                                    style={{ background: 'rgba(192,192,192,0.8)' }}
                                  >
                                    {props.payload?.value}%
                                  </text>
                                </g>
                              );
                            }
                            return <circle cx={props.cx} cy={props.cy} r={4} fill="#fff" stroke={color} strokeWidth={2} />;
                          }}
                          connectNulls
                        />
                      );
                    }
                    return lines;
                  })}
                </LineChart>
              </ResponsiveContainer>
              
              {/* Color Sample Bar - MODERN FLAT DESIGN */}
              <div style={{
                display: 'flex',
                width: '100%',
                marginTop: '20px',
                borderRadius: '6px',
                overflow: 'hidden',
                minHeight: '40px',
                border: '1px solid #e0e0e0'
              }}>
                {chartData.map((dataPoint, idx) => {
                  // EXACT Python logic: colorsys.hsv_to_rgb(HUE / 360, value / 100, 1)
                  let color;
                  if (variationType === 'saturation') {
                    // Varying saturation, fixed brightness (100%) - Python: hsv_to_rgb(hue/360, value/100, 1)
                    color = hsvToRgb(selectedHue, dataPoint.value / 100, 1);
                  } else {
                    // Varying brightness, fixed saturation (100%) - Python: hsv_to_rgb(hue/360, 1, value/100)
                    color = hsvToRgb(selectedHue, 1, dataPoint.value / 100);
                  }
                  
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: color,
                        width: `${100 / chartData.length}%`,
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      title={`${dataPoint.value}% ${variationType}`}
                    >
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: dataPoint.value < 50 ? '#ffffff' : '#000000'
                      }}>
                        {dataPoint.value}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="no-data">
              <p>No data available for the selected parameters.</p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Make sure your CSV files are in the public/ directory and contain data for the selected parameters.
              </p>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '24px',
          padding: '24px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e5e5'
        }}>
          <h4 style={{
            marginBottom: '20px',
            color: '#333333',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Key Insights
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #ffd700'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                Peak Clarity Range
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {peaks.clarityRange}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #87ceeb'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                Peak Comfort Range
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {peaks.comfortRange}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #28a745'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                Data Processing
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                Formula: clearest + 0.5×second_clear - least_clear
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #dc3545'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                Line Styles
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                Solid lines = clarity, dashed lines = comfort
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #6f42c1'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                Peak Markers
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                ⭐ Clarity peaks, 💎 Comfort peaks
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #fd7e14'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                Color Variation
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {variationType.charAt(0).toUpperCase() + variationType.slice(1)} 20-100%
              </div>
            </div>
          </div>
        </div>
      </div>
      <LikertBarChart />
    </div>
  );
};

export default ColorPerformanceAnalysis;