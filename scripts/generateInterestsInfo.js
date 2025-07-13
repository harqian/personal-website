import fs from 'fs';
import path from 'path';

const staticDir = path.join(process.cwd(), 'static');
const primaryOutputFile = path.join(process.cwd(), 'src/lib/primaryInterestsInfo.json');
const secondaryOutputFile = path.join(process.cwd(), 'src/lib/secondaryInterestsInfo.json');

function processInterests(interestsPath) {
  const categories = fs.readdirSync(interestsPath);
  const imports = {};
  
  categories.forEach(category => {
    if (category === ".DS_Store") {
      return;
    }
    
    const categoryPath = path.join(interestsPath, category);
    const stats = fs.statSync(categoryPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(categoryPath)
        .filter(file => ['.jpeg', '.jpg', '.png', '.gif', '.JPG'].some(ext => file.endsWith(ext)));
      
      imports[category] = {
        media: files.map(file => 
          `/${path.relative(staticDir, path.join(interestsPath, category, file))}`.replace(/\\/g, '/')
        ),
        index: 0
      };
    }
  });
  
  return imports;
}

function generateImageImports() {
  // Process primary interests
  const primaryInterestsPath = path.join(staticDir, 'interests_media');
  const primaryImports = processInterests(primaryInterestsPath);
  
  // Process secondary interests
  const secondaryInterestsPath = path.join(staticDir, 'secondary_interests_media');
  const secondaryImports = processInterests(secondaryInterestsPath);
  
  // Write primary interests to file
  fs.writeFileSync(primaryOutputFile, JSON.stringify(primaryImports, null, 2));
  console.log('Primary interests file generated');
  
  // Write secondary interests to file
  fs.writeFileSync(secondaryOutputFile, JSON.stringify(secondaryImports, null, 2));
  console.log('Secondary interests file generated');
}

generateImageImports();