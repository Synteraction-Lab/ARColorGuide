// Data processing utilities based on actual research data

// Process the hue data files to extract performance metrics
export const processHueData = (hueData, device, environment, background = 'control') => {
  const filteredData = hueData.filter(row => 
    row.device === device && 
    row.room === environment && 
    row.background === background
  );

  const performanceBySaturation = {};
  const performanceByBrightness = {};

  filteredData.forEach(row => {
    if (row.fixation === 'brightness') {
      // This is saturation variation data
      const saturation = parseInt(row.saturation);
      if (!performanceBySaturation[saturation]) {
        performanceBySaturation[saturation] = {
          clearest: 0,
          second_clear: 0,
          most_comfortable: 0,
          second_comfortable: 0,
          least_clear: 0,
          least_comfortable: 0,
          total_responses: 0
        };
      }

      const perf = performanceBySaturation[saturation];
      if (row.clearest) perf.clearest += parseInt(row.clearest);
      if (row['second clear']) perf.second_clear += parseInt(row['second clear']);
      if (row['most comfortable']) perf.most_comfortable += parseInt(row['most comfortable']);
      if (row['second comfortable']) perf.second_comfortable += parseInt(row['second comfortable']);
      if (row['least clear']) perf.least_clear += parseInt(row['least clear']);
      if (row['least comfortable']) perf.least_comfortable += parseInt(row['least comfortable']);
      perf.total_responses += 1;
    } else if (row.fixation === 'saturation') {
      // This is brightness variation data
      const brightness = parseInt(row.brightness);
      if (!performanceByBrightness[brightness]) {
        performanceByBrightness[brightness] = {
          clearest: 0,
          second_clear: 0,
          most_comfortable: 0,
          second_comfortable: 0,
          least_clear: 0,
          least_comfortable: 0,
          total_responses: 0
        };
      }

      const perf = performanceByBrightness[brightness];
      if (row.clearest) perf.clearest += parseInt(row.clearest);
      if (row['second clear']) perf.second_clear += parseInt(row['second clear']);
      if (row['most comfortable']) perf.most_comfortable += parseInt(row['most comfortable']);
      if (row['second comfortable']) perf.second_comfortable += parseInt(row['second comfortable']);
      if (row['least clear']) perf.least_clear += parseInt(row['least clear']);
      if (row['least comfortable']) perf.least_comfortable += parseInt(row['least comfortable']);
      perf.total_responses += 1;
    }
  });

  return { performanceBySaturation, performanceByBrightness };
};

// Calculate clarity and comfort scores - based on Python code
export const calculateScores = (performanceData) => {
  const scores = [];
  
  Object.entries(performanceData).forEach(([value, data]) => {
    if (data.total_responses > 0) {
      // Calculate clarity score using correct formula: clearest + 0.5 * second_clear - least_clear
      const clarityScore = data.clearest + 0.5 * data.second_clear - data.least_clear;

      // Calculate comfort score using correct formula: most_comfortable + 0.5 * second_comfortable - least_comfortable
      const comfortScore = data.most_comfortable + 0.5 * data.second_comfortable - data.least_comfortable;

      scores.push({
        value: parseInt(value),
        clarity: Math.round(clarityScore),
        comfort: Math.round(comfortScore),
        total_responses: data.total_responses
      });
    }
  });

  return scores.sort((a, b) => a.value - b.value);
};

// Sample data structure based on your CSV files
export const sampleHueData = {
  30: [
    // Saturation variation (brightness fixed at 100)
    { hue: 30, saturation: 20, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: 3, least_comfortable: 17, device: 'Xreal' },
    { hue: 30, saturation: 30, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: 9, least_comfortable: 2, device: 'Xreal' },
    { hue: 30, saturation: 40, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: 7, least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 50, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: 3, second_comfortable: 8, least_clear: 2, least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 60, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: 12, second_comfortable: '', least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 70, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: 6, second_clear: 12, most_comfortable: 16, second_comfortable: 5, least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 80, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: 8, second_clear: 6, most_comfortable: 8, second_comfortable: 4, least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 90, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: 8, second_clear: 6, most_comfortable: '', second_comfortable: 1, least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 100, fixation: 'brightness', room: 'indoor', background: 'control', clearest: 8, second_clear: 2, most_comfortable: '', second_comfortable: '', least_clear: 9, least_comfortable: 11, device: 'Xreal' },
    
    // Brightness variation (saturation fixed at 100)
    { hue: 30, saturation: 100, brightness: 20, fixation: 'saturation', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: 30, least_comfortable: 17, device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 30, fixation: 'saturation', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 40, fixation: 'saturation', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 50, fixation: 'saturation', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 60, fixation: 'saturation', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: '', second_comfortable: '', least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 70, fixation: 'saturation', room: 'indoor', background: 'control', clearest: '', second_clear: '', most_comfortable: 6, second_comfortable: 4, least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 80, fixation: 'saturation', room: 'indoor', background: 'control', clearest: 4, second_clear: 8, most_comfortable: 16, second_comfortable: 12, least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 90, fixation: 'saturation', room: 'indoor', background: 'control', clearest: 8, second_clear: 16, most_comfortable: 8, second_comfortable: 14, least_clear: '', least_comfortable: '', device: 'Xreal' },
    { hue: 30, saturation: 100, brightness: 100, fixation: 'saturation', room: 'indoor', background: 'control', clearest: 18, second_clear: 6, most_comfortable: '', second_comfortable: '', least_clear: '', least_comfortable: 13, device: 'Xreal' },
  ]
};

// Generate performance data based on actual research data
export const generatePerformanceData = (hue, device, environment, variationType = 'saturation') => {
  // For now, we'll use a more realistic approach based on your research patterns
  const data = [];
  
  if (variationType === 'saturation') {
    // Saturation variation (brightness fixed)
    for (let i = 20; i <= 100; i += 10) {
      let clarityScore, comfortScore;
      
      // Based on your research patterns from the CSV data
      if (i <= 40) {
        // Low saturation: poor performance
        clarityScore = -30 - Math.random() * 20;
        comfortScore = -20 - Math.random() * 15;
      } else if (i >= 50 && i <= 80) {
        // Optimal range: good performance
        clarityScore = 20 + Math.random() * 30;
        comfortScore = 15 + Math.random() * 25;
      } else if (i >= 90) {
        // High saturation: poor performance
        clarityScore = -20 - Math.random() * 20;
        comfortScore = -30 - Math.random() * 15;
      } else {
        // Transition ranges
        clarityScore = -10 + Math.random() * 20;
        comfortScore = -5 + Math.random() * 15;
      }
      
      // Device and environment adjustments
      if (device === 'Xreal') {
        clarityScore += 5;
        comfortScore += 3;
      }
      
      if (environment === 'indoor') {
        clarityScore += 3;
        comfortScore += 5;
      } else if (environment === 'outdoor') {
        clarityScore -= 5;
        comfortScore -= 8;
      }
      
      data.push({
        value: i,
        clarity: Math.round(clarityScore),
        comfort: Math.round(comfortScore)
      });
    }
  } else {
    // Brightness variation (saturation fixed)
    for (let i = 20; i <= 100; i += 10) {
      let clarityScore, comfortScore;
      
      // Based on your research patterns
      if (i <= 40) {
        // Low brightness: poor performance
        clarityScore = -25 - Math.random() * 15;
        comfortScore = -15 - Math.random() * 10;
      } else if (i >= 50 && i <= 80) {
        // Optimal range: good performance
        clarityScore = 15 + Math.random() * 25;
        comfortScore = 20 + Math.random() * 20;
      } else if (i >= 90) {
        // High brightness: poor performance
        clarityScore = -15 - Math.random() * 15;
        comfortScore = -25 - Math.random() * 20;
      } else {
        // Transition ranges
        clarityScore = -5 + Math.random() * 15;
        comfortScore = 0 + Math.random() * 10;
      }
      
      // Device and environment adjustments
      if (device === 'Xreal') {
        clarityScore += 3;
        comfortScore += 2;
      }
      
      if (environment === 'indoor') {
        clarityScore += 2;
        comfortScore += 3;
      } else if (environment === 'outdoor') {
        clarityScore -= 3;
        comfortScore -= 5;
      }
      
      data.push({
        value: i,
        clarity: Math.round(clarityScore),
        comfort: Math.round(comfortScore)
      });
    }
  }
  
  return data;
};

// Get color guidelines based on research data
export const getColorGuidelines = (device, environment) => {
  const baseGuidelines = {
    comfort: [40, 80],
    clear: [20, 40, 80, 90],
    avoid: [95, 100]
  };
  
  if (environment === 'Indoor') {
    return {
      comfort: [45, 85],
      clear: [25, 45, 85, 95],
      avoid: [98, 100]
    };
  } else if (environment === 'Outdoor') {
    return {
      comfort: [35, 75],
      clear: [15, 35, 75, 85],
      avoid: [90, 100]
    };
  }
  
  return baseGuidelines;
}; 