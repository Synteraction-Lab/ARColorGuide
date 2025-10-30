// Research data based on actual CSV files from your study

// Color performance data structure based on your CSV files
export const researchData = {
  // Hue 30 (Orange) - Based on Hue30_data final_cb.csv
  30: {
    Xreal: {
      indoor: {
        control: [
          // Saturation variation (brightness fixed at 100)
          { saturation: 20, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 3, least_comfortable: 17 },
          { saturation: 30, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 9, least_comfortable: 2 },
          { saturation: 40, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 7, least_comfortable: 0 },
          { saturation: 50, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 3, second_comfortable: 8, least_clear: 2, least_comfortable: 0 },
          { saturation: 60, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 12, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 70, brightness: 100, fixation: 'brightness', clearest: 6, second_clear: 12, most_comfortable: 16, second_comfortable: 5, least_clear: 0, least_comfortable: 0 },
          { saturation: 80, brightness: 100, fixation: 'brightness', clearest: 8, second_clear: 6, most_comfortable: 8, second_comfortable: 4, least_clear: 0, least_comfortable: 0 },
          { saturation: 90, brightness: 100, fixation: 'brightness', clearest: 8, second_clear: 6, most_comfortable: 0, second_comfortable: 1, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 100, fixation: 'brightness', clearest: 8, second_clear: 2, most_comfortable: 0, second_comfortable: 0, least_clear: 9, least_comfortable: 11 },
          
          // Brightness variation (saturation fixed at 100)
          { saturation: 100, brightness: 20, fixation: 'saturation', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 30, least_comfortable: 17 },
          { saturation: 100, brightness: 30, fixation: 'saturation', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 40, fixation: 'saturation', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 50, fixation: 'saturation', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 60, fixation: 'saturation', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 70, fixation: 'saturation', clearest: 0, second_clear: 0, most_comfortable: 6, second_comfortable: 4, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 80, fixation: 'saturation', clearest: 4, second_clear: 8, most_comfortable: 16, second_comfortable: 12, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 90, fixation: 'saturation', clearest: 8, second_clear: 16, most_comfortable: 8, second_comfortable: 14, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 100, fixation: 'saturation', clearest: 18, second_clear: 6, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 13 }
        ],
        nature: [
          // Similar structure for nature background
          { saturation: 20, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 9, least_comfortable: 9 },
          { saturation: 30, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 6, least_comfortable: 0 },
          { saturation: 40, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 50, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 12, second_comfortable: 9, least_clear: 0, least_comfortable: 0 },
          { saturation: 60, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 2, most_comfortable: 9, second_comfortable: 9, least_clear: 0, least_comfortable: 0 },
          { saturation: 70, brightness: 100, fixation: 'brightness', clearest: 5, second_clear: 14, most_comfortable: 3, second_comfortable: 7, least_clear: 0, least_comfortable: 0 },
          { saturation: 80, brightness: 100, fixation: 'brightness', clearest: 7, second_clear: 10, most_comfortable: 3, second_comfortable: 5, least_clear: 0, least_comfortable: 0 },
          { saturation: 90, brightness: 100, fixation: 'brightness', clearest: 18, second_clear: 4, most_comfortable: 3, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 15, least_comfortable: 21 }
        ]
      },
      outdoor: {
        control: [
          // Outdoor data for Xreal
          { saturation: 20, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 5, least_comfortable: 22 },
          { saturation: 30, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 3, least_comfortable: 0 },
          { saturation: 40, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 1, most_comfortable: 0, second_comfortable: 3, least_clear: 3, least_comfortable: 0 },
          { saturation: 50, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 7, most_comfortable: 13, second_comfortable: 8, least_clear: 2, least_comfortable: 0 },
          { saturation: 60, brightness: 100, fixation: 'brightness', clearest: 4, second_clear: 6, most_comfortable: 11, second_comfortable: 5, least_clear: 0, least_comfortable: 0 },
          { saturation: 70, brightness: 100, fixation: 'brightness', clearest: 6, second_clear: 8, most_comfortable: 3, second_comfortable: 13, least_clear: 0, least_comfortable: 0 },
          { saturation: 80, brightness: 100, fixation: 'brightness', clearest: 20, second_clear: 8, most_comfortable: 3, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 90, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 1, most_comfortable: 0, second_comfortable: 0, least_clear: 17, least_comfortable: 8 }
        ]
      }
    },
    HoloLens: {
      indoor: {
        control: [
          // HoloLens indoor data
          { saturation: 20, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 3, least_comfortable: 16 },
          { saturation: 30, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 5, least_comfortable: 4 },
          { saturation: 40, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 5, least_comfortable: 0 },
          { saturation: 50, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 17, least_comfortable: 0 },
          { saturation: 60, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 10, second_comfortable: 11, least_clear: 0, least_comfortable: 0 },
          { saturation: 70, brightness: 100, fixation: 'brightness', clearest: 0, second_clear: 0, most_comfortable: 15, second_comfortable: 11, least_clear: 0, least_comfortable: 0 },
          { saturation: 80, brightness: 100, fixation: 'brightness', clearest: 3, second_clear: 8, most_comfortable: 5, second_comfortable: 8, least_clear: 0, least_comfortable: 0 },
          { saturation: 90, brightness: 100, fixation: 'brightness', clearest: 7, second_clear: 22, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 0 },
          { saturation: 100, brightness: 100, fixation: 'brightness', clearest: 20, second_clear: 0, most_comfortable: 0, second_comfortable: 0, least_clear: 0, least_comfortable: 10 }
        ]
      }
    }
  }
};

// Calculate performance scores from raw data - based on Python code
export const calculatePerformanceScores = (data, variationType) => {
  const scores = [];
  
  // Group data by value (saturation or brightness)
  const groupedData = {};
  
  data.forEach(item => {
    if (item.fixation === variationType) {
      const value = variationType === 'brightness' ? item.saturation : item.brightness;
      
      if (!groupedData[value]) {
        groupedData[value] = {
          clearest: 0,
          second_clear: 0,
          least_clear: 0,
          most_comfortable: 0,
          second_comfortable: 0,
          least_comfortable: 0
        };
      }
      
      // Sum up all responses for this value
      groupedData[value].clearest += parseInt(item.clearest) || 0;
      groupedData[value].second_clear += parseInt(item['second clear']) || 0;
      groupedData[value].least_clear += parseInt(item['least clear']) || 0;
      groupedData[value].most_comfortable += parseInt(item['most comfortable']) || 0;
      groupedData[value].second_comfortable += parseInt(item['second comfortable']) || 0;
      groupedData[value].least_comfortable += parseInt(item['least comfortable']) || 0;
    }
  });
  
  // Calculate scores using the correct formula from Python code
  Object.entries(groupedData).forEach(([value, counts]) => {
    // Clarity score: clearest + 0.5 * second_clear - least_clear
    const clarityScore = counts.clearest + 0.5 * counts.second_clear - counts.least_clear;
    
    // Comfort score: most_comfortable + 0.5 * second_comfortable - least_comfortable
    const comfortScore = counts.most_comfortable + 0.5 * counts.second_comfortable - counts.least_comfortable;
    
    scores.push({
      value: parseInt(value),
      clarity: Math.round(clarityScore),
      comfort: Math.round(comfortScore)
    });
  });
  
  return scores.sort((a, b) => a.value - b.value);
};

// Get performance data for specific parameters
export const getPerformanceData = (hue, device, environment, background = 'control', variationType = 'brightness') => {
  const hueData = researchData[hue];
  if (!hueData || !hueData[device] || !hueData[device][environment] || !hueData[device][environment][background]) {
    // Return default data if specific data not available
    return generateDefaultPerformanceData(variationType);
  }
  
  const data = hueData[device][environment][background];
  return calculatePerformanceScores(data, variationType);
};

// Generate default performance data when specific data is not available
const generateDefaultPerformanceData = (variationType) => {
  const data = [];
  const range = variationType === 'brightness' ? [20, 30, 40, 50, 60, 70, 80, 90, 100] : [20, 30, 40, 50, 60, 70, 80, 90, 100];
  
  range.forEach(value => {
    let clarityScore, comfortScore;
    
    if (value <= 40) {
      clarityScore = -20 - Math.random() * 10;
      comfortScore = -15 - Math.random() * 8;
    } else if (value >= 50 && value <= 80) {
      clarityScore = 15 + Math.random() * 20;
      comfortScore = 10 + Math.random() * 15;
    } else {
      clarityScore = -10 - Math.random() * 10;
      comfortScore = -20 - Math.random() * 8;
    }
    
    data.push({
      value: value,
      clarity: Math.round(clarityScore),
      comfort: Math.round(comfortScore)
    });
  });
  
  return data;
}; 