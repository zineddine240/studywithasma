const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];

const replacements = [
  { regex: /bg-\[#7C3AED\]/g, replacement: 'bg-primary' },
  { regex: /text-\[#7C3AED\]/g, replacement: 'text-primary' },
  { regex: /border-\[#7C3AED\]/g, replacement: 'border-primary' },
  { regex: /hover:bg-\[#7C3AED\]/g, replacement: 'hover:bg-primary' },
  { regex: /hover:text-\[#7C3AED\]/g, replacement: 'hover:text-primary' },
  { regex: /hover:border-\[#7C3AED\]/g, replacement: 'hover:border-primary' },
  { regex: /group-hover:bg-\[#7C3AED\]/g, replacement: 'group-hover:bg-primary' },
  { regex: /group-hover:text-\[#7C3AED\]/g, replacement: 'group-hover:text-primary' },
  { regex: /group-hover:border-\[#7C3AED\]/g, replacement: 'group-hover:border-primary' },
  { regex: /ring-\[#7C3AED\]/g, replacement: 'ring-primary' },
  
  { regex: /bg-\[#4C1D95\]/g, replacement: 'bg-primary/80' },
  { regex: /hover:bg-\[#4C1D95\]/g, replacement: 'hover:bg-primary/80' },
  { regex: /text-\[#4C1D95\]/g, replacement: 'text-primary/80' },
  { regex: /hover:text-\[#4C1D95\]/g, replacement: 'hover:text-primary/80' },
  { regex: /group-hover:text-\[#4C1D95\]/g, replacement: 'group-hover:text-primary/80' },

  { regex: /text-\[#1E1B4B\]/g, replacement: 'text-foreground' },
  { regex: /bg-\[#1E1B4B\]/g, replacement: 'bg-card text-card-foreground' },
  { regex: /border-\[#1E1B4B\]/g, replacement: 'border-foreground' },

  { regex: /bg-\[#FAF7FF\]/g, replacement: 'bg-muted/30' },
  { regex: /border-\[#EDE9FE\]/g, replacement: 'border-border' },
  { regex: /bg-\[#EDE9FE\]/g, replacement: 'bg-secondary' },
  
  { regex: /text-\[#64748B\]/g, replacement: 'text-muted-foreground' },
  { regex: /text-\[#C4B5FD\]/g, replacement: 'text-primary/70' },
  { regex: /border-\[#C4B5FD\]/g, replacement: 'border-primary/50' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(path.join(__dirname, '..', dir));
}

console.log('Color replacement complete.');
