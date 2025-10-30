# AR Color Selection Guidelines

An interactive web application demonstrating research results on AR color selection guidelines for smart glasses. This project provides comprehensive color performance analysis and selection recommendations for different AR devices and environmental conditions.

## Features

### 🎨 Color Performance Analysis
- Interactive charts showing clarity and comfort scores
- Device comparison (Xreal vs HoloLens)
- Environment analysis (Indoor vs Outdoor)
- 12 different hue selections with real-time performance data
- Visual color previews with recommendations

### 📊 Color Selection Guide
- Comprehensive color guidelines based on research data
- Visual color bars showing optimal ranges
- Device and environment-specific recommendations
- Clear categorization: Comfort, Clear, and Avoid ranges
- Interactive hover effects and tooltips

## Technology Stack

- **React 18** - Modern React with hooks
- **Recharts** - Interactive charts and data visualization
- **CSS3** - Modern styling with responsive design
- **GitHub Pages** - Hosting and deployment

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ARColorGuide.git
cd ARColorGuide
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

### Deploying to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub username:
```json
{
  "homepage": "https://yourusername.github.io/ARColorGuide"
}
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

## Project Structure

```
ARColorGuide/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ColorPerformanceAnalysis.js
│   │   ├── ColorPerformanceAnalysis.css
│   │   ├── ColorSelectionGuide.js
│   │   └── ColorSelectionGuide.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Research Background

This application is based on comprehensive research on AR smart glasses color performance, including:

- **Device Analysis**: Xreal and HoloLens performance comparison
- **Environmental Factors**: Indoor, outdoor, and mixed lighting conditions
- **Color Properties**: Hue, saturation, and brightness optimization
- **User Experience Metrics**: Clarity and comfort scoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Research data and insights from AR color performance studies
- Recharts library for data visualization
- React community for excellent documentation and tools

## Contact

For questions or collaboration opportunities, please reach out through GitHub issues or your preferred contact method. 