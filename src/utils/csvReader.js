import { generateDefaultPerformanceData } from '../data/researchData';

// CSV Reader for processing original research data files - FIXED VERSION

const getAssetBasePath = () => {
  if (typeof window !== 'undefined' && window.__NEXT_DATA__?.assetPrefix) {
    return window.__NEXT_DATA__.assetPrefix;
  }
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
};

const buildAssetUrl = (filename) => {
  const basePath = getAssetBasePath().replace(/\/$/, '');
  const cleaned = filename.startsWith('/') ? filename.slice(1) : filename;
  return basePath ? `${basePath}/${cleaned}` : `/${cleaned}`;
};

// Read CSV file from the public directory (Next.js static file serving)
export const readCSVFile = async (filename) => {
  try {
    // In Next.js, static files are served from the public directory
    const response = await fetch(buildAssetUrl(filename));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // Check if we got HTML instead of CSV
    if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.trim().startsWith('<html')) {
      console.error(`Received HTML content instead of CSV for ${filename}`);
      return null;
    }
    
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error reading CSV file ${filename}:`, error);
    return null;
  }
};

// Parse CSV text into array of objects
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }
  
  // Parse header - remove quotes from headers
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index].replace(/"/g, '').trim();
        // Convert numeric values but keep empty strings as empty strings
        if (value !== '' && !isNaN(value)) {
          value = parseFloat(value);
        }
        row[header] = value;
      });
      data.push(row);
    }
  }
  
  return data;
};

// Parse a single CSV line, handling quoted values
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
};

// Get all available hue data files
export const getAvailableHueFiles = async () => {
  try {
    // In a real implementation, you might want to fetch a file list from the server
    // For now, we'll return the known hue files based on your data
    const hueFiles = [
      'Hue30_data_final_cb.csv',
      'Hue45_data_final_cb.csv', 
      'Hue60_data_final_cb.csv',
      'Hue75_data_final_cb.csv',
      'Hue135_data_final_cb.csv',
      'Hue180_data_final_cb.csv',
      'Hue195_data_final_cb.csv',
      'Hue240_data_final_cb.csv',
      'Hue270_data_final_cb.csv',
      'Hue285_data_final_cb.csv',
      'Hue315_data_final_cb.csv',
      'Hue345_data_final_cb.csv'
    ];
    
    return hueFiles;
  } catch (error) {
    console.error('Error getting hue files:', error);
    return [];
  }
};

// Load all hue data
export const loadAllHueData = async () => {
  const hueFiles = await getAvailableHueFiles();
  const allData = {};
  
  for (const filename of hueFiles) {
    try {
      const hueNumber = parseInt(filename.match(/Hue(\d+)/)[1]);
      const data = await readCSVFile(filename);
      
      if (data && data.length > 0) {
        allData[hueNumber] = data;
        console.log(`Loaded ${data.length} rows for Hue ${hueNumber}`);
      }
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
    }
  }
  
  return allData;
};

// Process hue data for specific parameters - FIXED VERSION
export const processHueData = (data, device, environment, background = 'control', analysisType = 'brightness') => {
  if (!data || data.length === 0) {
    console.log('No data provided to processHueData');
    return [];
  }
  
  console.log('Processing data with parameters:', { device, environment, background, analysisType });
  console.log('Total data rows:', data.length);
  
  // CORRECTED LOGIC - This was the main bug!
  // When analysisType is 'saturation', we want to see how saturation varies
  // So we look for rows where fixation='brightness' (brightness is fixed, saturation varies)
  // When analysisType is 'brightness', we want to see how brightness varies  
  // So we look for rows where fixation='saturation' (saturation is fixed, brightness varies)
  
  let fixationFilter;
  if (analysisType === 'saturation') {
    fixationFilter = 'brightness'; // brightness is fixed, saturation varies
  } else if (analysisType === 'brightness') {
    fixationFilter = 'saturation';  // saturation is fixed, brightness varies
  } else {
    // Fallback to old parameter names for backward compatibility
    fixationFilter = analysisType;
  }
  
  // Filter data based on parameters
  const filteredData = data.filter(row => {
    const matches = row.device === device && 
                   row.room === environment && 
                  //  row.background === background &&
                   row.fixation === fixationFilter;
    
    if (matches) {
      console.log('Matched row:', row);
    }
    
    return matches;
  });
  
  console.log('Filtered data rows:', filteredData.length);
  
  if (filteredData.length === 0) {
    console.log('No data matches the specified parameters');
    console.log('Available fixation values:', [...new Set(data.map(r => r.fixation))]);
    console.log('Available device values:', [...new Set(data.map(r => r.device))]);
    console.log('Available room values:', [...new Set(data.map(r => r.room))]);
    return [];
  }
  
  // Group by saturation or brightness value
  const groupedData = {};
  const allowedValues = [20,30,40,50,60,70,80,90,100];
  
  filteredData.forEach(row => {
    // CORRECTED - Get the varying parameter based on analysis type
    let value;
    if (analysisType === 'saturation') {
      // We're analyzing saturation variation, so group by saturation
      value = parseInt(row.saturation);
    } else {
      // We're analyzing brightness variation, so group by brightness
      value = parseInt(row.brightness);
    }
    
    if (isNaN(value) || !allowedValues.includes(value)) {
      // Only keep values from 20-100 with step of 10
      return;
    }
    
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
    
    // Sum up all responses for this value (handle empty strings)
    // FIXED: Use exact same logic as Python
    const clearest = (row.clearest === "" || row.clearest == null) ? 0 : parseFloat(row.clearest);
    const second_clear = (row['second clear'] === "" || row['second clear'] == null) ? 0 : parseFloat(row['second clear']);
    const least_clear = (row['least clear'] === "" || row['least clear'] == null) ? 0 : parseFloat(row['least clear']);
    const most_comfortable = (row['most comfortable'] === "" || row['most comfortable'] == null) ? 0 : parseFloat(row['most comfortable']);
    const second_comfortable = (row['second comfortable'] === "" || row['second comfortable'] == null) ? 0 : parseFloat(row['second comfortable']);
    const least_comfortable = (row['least comfortable'] === "" || row['least comfortable'] == null) ? 0 : parseFloat(row['least comfortable']);
    
    groupedData[value].clearest += clearest;
    groupedData[value].second_clear += second_clear;
    groupedData[value].least_clear += least_clear;
    groupedData[value].most_comfortable += most_comfortable;
    groupedData[value].second_comfortable += second_comfortable;
    groupedData[value].least_comfortable += least_comfortable;
  });
  
  console.log('Grouped data:', groupedData);
  
  // Calculate scores using the correct formula - FIXED precision
  const scores = [];
  Object.entries(groupedData).forEach(([value, counts]) => {
    // Clarity score: clearest + 0.5 * second_clear - least_clear (keep decimal precision)
    const clarityScore = counts.clearest + 0.5 * counts.second_clear - counts.least_clear;
    
    // Comfort score: most_comfortable + 0.5 * second_comfortable - least_comfortable (keep decimal precision)
    const comfortScore = counts.most_comfortable + 0.5 * counts.second_comfortable - counts.least_comfortable;
    
    scores.push({
      value: parseInt(value),
      clarity: clarityScore, // Don't round yet, keep exact precision
      comfort: comfortScore  // Don't round yet, keep exact precision
    });
  });
  
  console.log('Calculated scores:', scores);
  return scores.sort((a, b) => a.value - b.value);
};

// Get performance data for specific parameters
export const getPerformanceData = async (hue, device, environment, background = null, analysisType = 'brightness') => {
  try {
    const filename = `Hue${hue}_data_final_cb.csv`;
    const data = await readCSVFile(filename);
    
    if (!data || data.length === 0) {
      console.warn(`No data found for Hue ${hue}`);
      return generateDefaultPerformanceData(analysisType);
    }
    
    // Note: background parameter is ignored to match Python behavior (include all backgrounds)
    return processHueData(data, device, environment, null, analysisType);
  } catch (error) {
    console.error(`Error getting performance data for Hue ${hue}:`, error);
    return generateDefaultPerformanceData(analysisType);
  }
};
