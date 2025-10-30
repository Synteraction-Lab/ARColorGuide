import React, { useState } from 'react';

const ColorSelectionGuide = () => {
  // Hue order from the paper
  const hueOrder = [240, 270, 285, 315, 345, 30, 45, 60, 75, 135, 180, 195];
  const NUM_BLOCKS = 17;
  // State for copy notification
  const [copyNotification, setCopyNotification] = useState({ show: false, message: '', color: '' });

  // Device and environment options for button groups
  const DEVICE_OPTIONS = [
    { key: 'Xreal', label: 'Xreal' },
    { key: 'HoloLens', label: 'HoloLens' }
  ];
  const ENV_OPTIONS = [
    { key: 'Mix', label: 'Mix' },
    { key: 'Indoor', label: 'Indoor' },
    { key: 'Outdoor', label: 'Outdoor' }
  ];

  // State for device and environment selection
  const [selectedDevices, setSelectedDevices] = useState(['Xreal', 'HoloLens']);
  const [selectedEnvironments, setSelectedEnvironments] = useState(['Mix', 'Indoor', 'Outdoor']);

  // Toggle functions for multi-select (button group style)
  const toggleDevice = (device) => {
    setSelectedDevices(prev =>
      prev.includes(device)
        ? prev.filter(d => d !== device)
        : [...prev, device]
    );
  };

  const toggleEnvironment = (env) => {
    setSelectedEnvironments(prev =>
      prev.includes(env)
        ? prev.filter(e => e !== env)
        : [...prev, env]
    );
  };

  // Function to copy color to clipboard and show notification
  const copyColorToClipboard = async (colorHex, hue, saturation, value) => {
    try {
      await navigator.clipboard.writeText(colorHex);
      setCopyNotification({
        show: true,
        message: `Copied ${colorHex}`,
        color: colorHex
      });
      
      // Auto hide after 2 seconds
      setTimeout(() => {
        setCopyNotification({ show: false, message: '', color: '' });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  // Generate condition keys based on selection
  const getSelectedConditions = () => {
    const conditions = [];
    selectedDevices.forEach(device => {
      selectedEnvironments.forEach(env => {
        // Map display names to actual data keys
        const deviceKey = device === 'HoloLens' ? 'Hololens' : device;
        const conditionKey = `${deviceKey}_${env}`;
        if (allGuidelineData[conditionKey]) {
          conditions.push({
            key: conditionKey,
            title: `${device}_${env}`
          });
        }
      });
    });
    return conditions;
  };

    // Convert absolute coordinates to block indices
    const convertAbsoluteCoordsToBlocks = (absoluteRanges) => {
      if (!absoluteRanges || absoluteRanges.length === 0) return [];
      
      return absoluteRanges.map(([start, end]) => {
        let startBlock, endBlock;
        
        if (start < 0 && end < 0) {
          // Both negative (left side - brightness variation)
          // Map -100 to -20 → blocks 0 to 7
          // -100→block 0, -90→block 1, -80→block 2, ..., -20→block 7
          startBlock = Math.max(0, Math.floor((Math.abs(end) - 20) / 10));
          endBlock = Math.min(7, Math.floor((Math.abs(start) - 20) / 10));
        } else if (start > 0 && end > 0) {
          // Both positive (right side - saturation variation)  
          // Map +100 to +20 → blocks 9 to 16
          // +100→block 9, +90→block 10, +80→block 11, ..., +20→block 16
          // Fixed: Correct mapping for right side
          startBlock = Math.max(8, 8 + Math.floor((100 - start) / 10));
          endBlock = Math.min(16, 8 + Math.floor((100 - end) / 10));
        } else if (start === -100 && end === 100) {
          // Special case: full range
          return [0, 16];
        } else {
          // Mixed or special cases - handle individually
          return null;
        }
        
        return [startBlock, endBlock];
      }).filter(range => range !== null);
    };
  

  // Absolute coordinate system data
  // Format: [start, end] where negative = left side, positive = right side
  const absoluteGuidelineData = {
    Xreal_Mix: {
      240: { 
        clear: [[80, 80]], 
        comfort: [[60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      270: { 
        clear: [[90, 90]], 
        comfort: [[60, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      285: { 
        clear: [[60, 50]], 
        comfort: [[60, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      315: { 
        clear: [[90, 70]], 
        comfort: [[60, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      345: { 
        clear: [[80, 70]], 
        comfort: [[50, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      30: { 
        clear: [[90, 80]], 
        comfort: [[70, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      45: { 
        clear: [[90, 80]], 
        comfort: [[80, 70]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      60: { 
        clear: [[90, 80]], 
        comfort: [[60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      75: { 
        clear: [[90, 80]], 
        comfort: [[70, 60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      135: { 
        clear: [[90, 80]], 
        comfort: [[60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      180: { 
        clear: [[80, 70]], 
        comfort: [[60, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      195: { 
        clear: [[90, 80]], 
        comfort: [[70, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      }
    },
    Xreal_Indoor: {
      240: { 
        clear: [[80, 70]], 
        comfort: [[70, 50]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      270: { 
        clear: [[90, 90], [70, 70]], 
        comfort: [[90, 90], [70, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      285: { 
        clear: [[60, 50]], 
        comfort: [[50, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      315: { 
        clear: [[90, 60]], 
        comfort: [[60, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      345: { 
        clear: [[80, 60]], 
        comfort: [[60, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      30: { 
        clear: [[90, 80]], 
        comfort: [[80, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      45: { 
        clear: [[90, 70]], 
        comfort: [[70,60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      60: { 
        clear: [[90, 70]], 
        comfort: [[60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      75: { 
        clear: [[90, 80]], 
        comfort: [[70, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      135: { 
        clear: [[90, 80]], 
        comfort: [[60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      180: { 
        clear: [[80, 60]], 
        comfort: [[60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      195: { 
        clear: [[90, 80]], 
        comfort: [[70, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      }
    },
    Xreal_Outdoor: {
      240: { 
        clear: [[80, 80], [50, 50]],
        comfort: [[60, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      270: { 
        clear: [[90, 90], [50, 40]],
        comfort: [[60, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      285: { 
        clear: [[60, 40]], 
        comfort: [[60, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      315: { 
        clear: [[90, 70]], 
        comfort: [[60, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      345: { 
        clear: [[80, 70]], 
        comfort: [[50, 40]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      30: { 
        clear: [[90, 70]], 
        comfort: [[70, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      45: { 
        clear: [[90, 80]], 
        clear: [[80, 70]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      60: { 
        clear: [[90, 80]], 
        comfort: [[60, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      75: { 
        clear: [[90, 80]], 
        comfort: [[70, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      135: { 
        clear: [[90, 80]], 
        comfort: [[70, 50]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      180: { 
        clear: [[90, 70]], 
        comfort: [[70, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      195: { 
        clear: [[90, 80]], 
        comfort: [[70, 60]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      }
    },
    // HoloLens data as replicas of Xreal data with slight variations
    Hololens_Mix: {
      240: { 
        comfort: [[75, 75]], 
        clear: [[55, 45]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      270: { 
        comfort: [[85, 85]], 
        clear: [[55, 55]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      285: { 
        comfort: [[55, 45]], 
        clear: [[55, 55]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      315: { 
        comfort: [[85, 65]], 
        clear: [[55, 35]], 
        avoid: [[-60, -20], [100, 100], [20, 20]] 
      },
      345: {
        comfort: [[85, 65]],
        clear: [[55, 35]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      30: {
        comfort: [[75, 65]],
        clear: [[55, 45]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      45: {
        comfort: [[85, 65]],
        clear: [[55, 35]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      60: {
        comfort: [[75, 65]],
        clear: [[55, 45]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      75: {
        comfort: [[85, 65]],
        clear: [[55, 35]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      135: {
        comfort: [[85, 85]],
        clear: [[65, 55]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      180: {
        comfort: [[85, 85]],
        clear: [[75, 55]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      },
      195: {
        comfort: [[75, 75]],
        clear: [[65, 55]],
        avoid: [[-60, -20], [100, 100], [20, 20]]
      }
    },
    Hololens_Indoor: {
      240: { 
        comfort: [[-90, -80]], 
        clear: [[-95, -70], [70, 95]], 
        avoid: [[-60, -20], [-100, -95]] 
      },
      270: { 
        comfort: [[-95, -80]], 
        clear: [[-100, -70], [70, 100]], 
        avoid: [[-60, -20], [-100, -95]] 
      },
      285: { 
        comfort: [[-90, -75]], 
        clear: [[-95, -65], [65, 95]], 
        avoid: [[-55, -20]] 
      },
      315: { 
        comfort: [[-85, -70]], 
        clear: [[-90, -60], [60, 90]], 
        avoid: [[-50, -20]] 
      },
      345: { 
        comfort: [[-90, -75]], 
        clear: [[-95, -65], [65, 95]], 
        avoid: [[-55, -20]] 
      },
      30: { 
        comfort: [[-100, -80]], 
        clear: [[-100, -75], [75, 100]], 
        avoid: [[-65, -20]] 
      },
      45: { 
        comfort: [[-100, -85]], 
        clear: [[-100, -80], [80, 100]], 
        avoid: [[-70, -20]] 
      },
      60: { 
        comfort: [[-100, -85]], 
        clear: [[-100, -80], [80, 100]], 
        avoid: [[-70, -20]] 
      },
      75: { 
        comfort: [[-100, -90]], 
        clear: [[-100, -85], [85, 100]], 
        avoid: [[-75, -20]] 
      },
      135: { 
        comfort: [[-100, -90]], 
        clear: [[-100, -85], [85, 100]], 
        avoid: [[-75, -20]] 
      },
      180: { 
        comfort: [[-100, -85]], 
        clear: [[-100, -80], [80, 100]], 
        avoid: [[-70, -20]] 
      },
      195: { 
        comfort: [[-95, -80]], 
        clear: [[-100, -75], [75, 100]], 
        avoid: [[-65, -20]] 
      }
    },
    Hololens_Outdoor: {
      240: { 
        comfort: [[-80, -70]], 
        clear: [[-85, -60], [60, 85]], 
        avoid: [[-50, -20], [-100, -90]] 
      },
      270: { 
        comfort: [[-85, -70]], 
        clear: [[-90, -60], [60, 90]], 
        avoid: [[-50, -20], [-100, -90]] 
      },
      285: { 
        comfort: [[-80, -65]], 
        clear: [[-85, -55], [55, 85]], 
        avoid: [[-45, -20]] 
      },
      315: { 
        comfort: [[-75, -60]], 
        clear: [[-80, -50], [50, 80]], 
        avoid: [[-40, -20]] 
      },
      345: { 
        comfort: [[-80, -65]], 
        clear: [[-85, -55], [55, 85]], 
        avoid: [[-45, -20]] 
      },
      30: { 
        comfort: [[-90, -70]], 
        clear: [[-95, -65], [65, 95]], 
        avoid: [[-55, -20]] 
      },
      45: { 
        comfort: [[-90, -75]], 
        clear: [[-95, -70], [70, 95]], 
        avoid: [[-60, -20]] 
      },
      60: { 
        comfort: [[-95, -75]], 
        clear: [[-100, -70], [70, 100]], 
        avoid: [[-60, -20]] 
      },
      75: { 
        comfort: [[-95, -80]], 
        clear: [[-100, -75], [75, 100]], 
        avoid: [[-65, -20]] 
      },
      135: { 
        comfort: [[-95, -80]], 
        clear: [[-100, -75], [75, 100]], 
        avoid: [[-65, -20]] 
      },
      180: { 
        comfort: [[-90, -75]], 
        clear: [[-95, -70], [70, 95]], 
        avoid: [[-60, -20]] 
      },
      195: { 
        comfort: [[-85, -70]], 
        clear: [[-90, -65], [65, 90]], 
        avoid: [[-55, -20]] 
      }
    }
  };

  // Generate all condition data using the absolute coordinate system
  const allGuidelineData = {
    ...absoluteGuidelineData
  };

  /**
   * Renders the border for 'comfort' and 'clear' ranges.
   */
  const OutlineBox = ({ range, type }) => {
    const [startBlock, endBlock] = range;
    const style = {
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      left: `${startBlock / NUM_BLOCKS * 100}%`,
      width: `${(endBlock - startBlock + 1) / NUM_BLOCKS * 100}%`,
      boxSizing: 'border-box',
      pointerEvents: 'none',
    };

    style.borderRadius = '6px';
    if (type === 'comfort') {
      style.border = '2px dotted white';
    } else if (type === 'clear') {
      style.border = '2px solid white';
    }

    return <div style={style} />;
  };

  /**
   * Renders the inner line for the 'avoid' range.
   */
  const AvoidLine = ({ range }) => {
    const [startBlock, endBlock] = range;
    return <div style={{
      position: 'absolute',
      top: '50%',
      left: `${startBlock / NUM_BLOCKS * 100}%`,
      width: `${(endBlock - startBlock + 1) / NUM_BLOCKS * 100}%`,
      transform: 'translateY(-50%)',
      height: '2px',
      backgroundColor: 'white',
      pointerEvents: 'none',
    }} />;
  };

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

  /**
   * Renders a single continuous color strip for a given hue.
   */
  const ColorStrip = ({ hue }) => {
    const blocks = Array.from({ length: NUM_BLOCKS }, (_, i) => {
      let saturation, value; // Using HSV: saturation and value (brightness)

      // Fixed format: Left side = brightness variation, Right side = saturation variation
      if (i < 8) { // Left side: Value(brightness) variation from 20% to 90%
        saturation = 1.0; // Fixed saturation at 100%
        value = (20 + i * 10) / 100; // 0.2 to 0.9
      } else if (i === 8) { // Center: 100% saturation, 100% value
        saturation = 1.0;
        value = 1.0;
      } else { // Right side: Saturation variation from 90% to 20%
        saturation = (100 - (i - 8) * 10) / 100; // 0.9 to 0.2
        value = 1.0; // Fixed value at 100%
      }
      
      const colorHex = hsvToRgb(hue, saturation, value);
      
      return (
        <div
          key={i}
          style={{
            backgroundColor: colorHex,
            flex: 1,
            cursor: 'pointer',
            transition: 'transform 0.1s ease',
          }}
          onClick={() => copyColorToClipboard(colorHex, hue, saturation, value)}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
          title={`Click to copy ${colorHex}`}
        />
      );
    });

    return <div style={{ display: 'flex', width: '100%', height: '100%' }}>{blocks}</div>;
  };

  /**
   * Renders a full row for a single hue.
   */
  const HueRow = ({ hue, guideline }) => {
    // Convert our absolute coordinate data to block indices
    const comfortBlocks = convertAbsoluteCoordsToBlocks(guideline.comfort);
    const clearBlocks = convertAbsoluteCoordsToBlocks(guideline.clear);
    const avoidBlocks = convertAbsoluteCoordsToBlocks(guideline.avoid);

    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px', height: '24px' }}>
        <div style={{ width: '30px', textAlign: 'right', marginRight: '8px', fontSize: '12px', color: 'white' }}>
          {hue}
        </div>
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <ColorStrip hue={hue} />
          {comfortBlocks.map((range, i) => <OutlineBox key={`c-${i}`} range={range} type="comfort" />)}
          {clearBlocks.map((range, i) => <OutlineBox key={`cl-${i}`} range={range} type="clear" />)}
          {avoidBlocks.map((range, i) => <AvoidLine key={`a-${i}`} range={range} />)}
        </div>
      </div>
    );
  };

  /**
   * Renders a complete chart for one condition.
   */
  const GuidelineChart = ({ conditionKey, title }) => (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 'normal', marginBottom: '10px', color: 'white' }}>{title}</h3>
      
      {/* Scale labels - precisely aligned with color blocks */}
      <div style={{ 
        fontSize: '10px', 
        color: '#aaa', 
        display: 'flex', 
        paddingLeft: '38px', 
        marginBottom: '5px',
        position: 'relative'
      }}>
        {/* Generate aligned number labels */}
        {Array.from({ length: NUM_BLOCKS }, (_, i) => {
          let value;
          if (i < 8) {
            value = 20 + i * 10; // 20, 30, 40, 50, 60, 70, 80, 90
          } else if (i === 8) {
            value = 100; // Center
          } else {
            value = 100 - (i - 8) * 10; // 90, 80, 70, 60, 50, 40, 30, 20
          }
          
          return (
            <div 
              key={i}
              style={{ 
                width: `${100 / NUM_BLOCKS}%`,
                textAlign: 'center',
                fontSize: '9px'
              }}
            >
              {value}
            </div>
          );
        })}
      </div>
      
      {hueOrder.map(hue => (
        <HueRow key={hue} hue={hue} guideline={allGuidelineData[conditionKey][hue]} />
      ))}
    </div>
  );

  /**
   * Renders the legend and instructions.
   */
  const Legend = () => (
    <div style={{ marginBottom: '30px' }}>
      {/* Main Legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', marginBottom: '20px', paddingRight:'20px', color: '#333' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '15px', border: '2px dashed #888', borderRadius: '6px', boxSizing: 'border-box' }} />
          <span>Comfort color</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '15px', border: '2px solid gray', borderRadius: '10px', boxSizing: 'border-box', boxShadow: '0 0 0 0.5px #bbb, 0 0 0 1.5px #bbb' }} />
          <span>Clear color</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', backgroundColor: '#888' }} />
          <span>Avoid use</span>
        </div>
      </div>
      
      {/* Color Strip Instructions */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '15px', 
        borderRadius: '8px', 
        color: '#333',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', color: '#333' }}>
          Color Strip Guide
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#ffd700', fontWeight: 'bold' }}>
              ← Brightness Variation
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
              Fixed Saturation (100%)
            </div>
            <div style={{ fontSize: '10px', color: '#888' }}>
              Brightness: 20% ← 90%
            </div>
          </div>
          
          <div style={{ textAlign: 'center', minWidth: '60px' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '4px 8px', 
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              100
            </div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '2px' }}>
              Pure Color (Saturation, Brightness = 100%)
            </div>
          </div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#87ceeb', fontWeight: 'bold' }}>
              Saturation Variation →
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
              Fixed Brightness (100%)
            </div>
            <div style={{ fontSize: '10px', color: '#888' }}>
              Saturation: 90% → 20%
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '32px 0', fontFamily: 'sans-serif' }}>
      {/* Copy notification */}
      {copyNotification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#333',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInOut 2s ease-in-out'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: 3,
            backgroundColor: copyNotification.color,
            border: '1px solid #fff'
          }} />
          {copyNotification.message}
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#222', marginBottom: 8 }}>Color Selection Guide</h2>
          <p style={{ color: '#555', fontSize: 16, marginBottom: 24 }}>
            Visualize recommended color selection ranges for AR overlays, based on device and environment. Use the controls below to filter guidelines.
          </p>

          {/* Device & Environment Button Groups */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontWeight: 600, color: '#333', marginRight: 12 }}>Device:</label>
              <div style={{ display: 'inline-flex', gap: 8 }}>
                {DEVICE_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`btn ${selectedDevices.includes(opt.key) ? 'active' : 'btn-secondary'}`}
                    style={{
                      background: selectedDevices.includes(opt.key) ? '#ffd700' : '#f5f5f5',
                      color: selectedDevices.includes(opt.key) ? '#333' : '#888',
                      border: selectedDevices.includes(opt.key) ? '2px solid #333' : '2px solid #ddd',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 15,
                      padding: '8px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => toggleDevice(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600, color: '#333', marginRight: 12 }}>Environment:</label>
              <div style={{ display: 'inline-flex', gap: 8 }}>
                {ENV_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    className={`btn ${selectedEnvironments.includes(opt.key) ? 'active' : 'btn-secondary'}`}
                    style={{
                      background: selectedEnvironments.includes(opt.key) ? '#87ceeb' : '#f5f5f5',
                      color: selectedEnvironments.includes(opt.key) ? '#333' : '#888',
                      border: selectedEnvironments.includes(opt.key) ? '2px solid #333' : '2px solid #ddd',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 15,
                      padding: '8px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => toggleEnvironment(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend and Instructions */}
          <Legend />
        </div>

        {/* Guideline Charts */}
        <div className="card" style={{ background: '#000000', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
            {getSelectedConditions().map(condition => (
              <GuidelineChart key={condition.key} conditionKey={condition.key} title={condition.title} />
            ))}
          </div>
        </div>

        {/* How to read section */}
        <div className="card" style={{ background: '#f8f9fa', borderRadius: 10, padding: 24, margin: '0 auto', maxWidth: 800, color: '#333', fontSize: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>How to read</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#555', fontSize: 13 }}>
            <li>Each color strip shows brightness variation (left) and saturation variation (right) for each hue.</li>
            <li>Solid white borders indicate clear ranges, dotted white borders show comfort ranges, and white lines mark colors to avoid.</li>
            <li>Use the device and environment buttons above to filter the guideline charts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorSelectionGuide;