
const fs = require('fs');

try {
  const settingsContent = fs.readFileSync('.vscode/settings.json', 'utf8');
  const settings = JSON.parse(settingsContent);

  if (settings['terminal.integrated.sendKeybindingsToShell'] === true) {
    console.log('Test case for settings.json passed!');
  } else {
    console.error('Test case for settings.json failed: "terminal.integrated.sendKeybindingsToShell" is not true.');
  }
} catch (error) {
  console.error('Test case for settings.json failed with an error:', error);
}
