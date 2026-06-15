const fs = require('fs');

const logPath = 'C:\\Users\\rahul123\\.gemini\\antigravity\\brain\\d4c01f8d-9b91-4ab5-94ab-ec7bfa6a9682\\.system_generated\\logs\\overview.txt';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(l => l.trim() !== '');

let revertData = {};

lines.forEach(line => {
  try {
    const data = JSON.parse(line);
    if (data.source === 'MODEL' && data.tool_calls) {
      data.tool_calls.forEach(call => {
        if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
          let args = {};
          if (typeof call.args === 'string') {
             args = JSON.parse(call.args);
          } else {
             args = call.args;
          }
          
          let targetFile = args.TargetFile;
          if (typeof targetFile === 'string' && targetFile.startsWith('"')) {
            targetFile = JSON.parse(targetFile);
          }
          
          if (!revertData[targetFile]) {
             revertData[targetFile] = [];
          }
          
          let chunks = [];
          if (call.name === 'multi_replace_file_content') {
            chunks = args.ReplacementChunks;
            if (typeof chunks === 'string') {
              chunks = JSON.parse(chunks);
            }
          } else {
            let tc = args.TargetContent;
            let rc = args.ReplacementContent;
            if (typeof tc === 'string' && tc.startsWith('"')) tc = JSON.parse(tc);
            if (typeof rc === 'string' && rc.startsWith('"')) rc = JSON.parse(rc);
            chunks = [{ TargetContent: tc, ReplacementContent: rc }];
          }
          
          if (Array.isArray(chunks)) {
            chunks.forEach(chunk => {
              // We want to REVERSE the replace
              revertData[targetFile].push({
                 original: chunk.ReplacementContent,
                 toReplace: chunk.TargetContent
              });
            });
          }
        }
      });
    }
  } catch (e) {
    // ignore parse errors
  }
});

// Since there could be multiple replacements on the same file in succession,
// reversing them exactly requires applying them in reverse order.
for (const file of Object.keys(revertData)) {
   revertData[file].reverse();
}

fs.writeFileSync('revert_plan.json', JSON.stringify(revertData, null, 2));
console.log('Revert plan generated.');
