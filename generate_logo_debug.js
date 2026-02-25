import fs from 'fs';
import path from 'path';

const svgPath = path.join(process.cwd(), 'auraverde-app/public/logolocal.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Regex to find d attributes
const dRegex = /d="([^"]+)"/g;
let match;
const paths = [];
while ((match = dRegex.exec(svgContent)) !== null) {
  paths.push(match[1]);
}

const componentContent = `
export default function LogoDebug() {
  const paths = ${JSON.stringify(paths)};
  
  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Logo Path Debugger</h1>
      <div className="grid grid-cols-4 gap-8">
        {paths.map((d, i) => (
          <div key={i} className="border p-4 rounded-lg flex flex-col items-center">
            <h2 className="mb-2 font-mono">Path {i + 1}</h2>
            <svg 
              viewBox="2484.59 2953.95 15788.21 14005.09" 
              className="w-32 h-32 border border-gray-100"
            >
              <path d={d} fill="black" />
            </svg>
          </div>
        ))}
      </div>
      
      <h2 className="text-xl font-bold mt-10 mb-4">Original Combined</h2>
      <svg 
        viewBox="2484.59 2953.95 15788.21 14005.09" 
        className="w-64 h-64 border border-gray-100"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} fill={i % 2 === 0 ? 'green' : 'blue'} opacity="0.8" />
        ))}
      </svg>
    </div>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'auraverde-app/src/pages/LogoDebug.jsx'), componentContent);
console.log('Generated LogoDebug.jsx with ' + paths.length + ' paths.');
