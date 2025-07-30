# TD Studios Development Cheat Sheet

## 🚀 Quick Commands

### Development Server

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Check for linting errors
npm run lint:fix     # Fix auto-fixable linting errors
npm run type-check   # Run TypeScript type checking
npm run format       # Format all files with Prettier
npm run format:check # Check if files are formatted correctly
```

## ⌨️ Cursor/VSCode Shortcuts

### Essential Shortcuts

- `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Win/Linux) - Command Palette
- `Cmd+P` / `Ctrl+P` - Quick Open Files
- `Cmd+Shift+E` / `Ctrl+Shift+E` - File Explorer
- `Cmd+Shift+X` / `Ctrl+Shift+X` - Extensions Panel
- `Cmd+\`` /`Ctrl+\`` - Toggle Terminal

### Code Editing

- `Cmd+S` / `Ctrl+S` - Save & Auto-format
- `Cmd+D` / `Ctrl+D` - Select next occurrence
- `Cmd+Shift+L` / `Ctrl+Shift+L` - Select all occurrences
- `Alt+Click` - Multiple cursors
- `Cmd+/` / `Ctrl+/` - Toggle line comment

### Navigation

- `Cmd+Click` / `Ctrl+Click` - Go to definition
- `Cmd+Shift+O` / `Ctrl+Shift+O` - Go to symbol
- `Cmd+G` / `Ctrl+G` - Go to line
- `F12` - Go to definition
- `Shift+F12` - Find all references

## 🔧 Extension Features

### Tailwind CSS IntelliSense

- Type `bg-` and see color suggestions
- Hover over classes to see CSS properties
- Auto-complete for responsive prefixes (`sm:`, `md:`, etc.)

### ESLint

- Red squiggly lines indicate errors
- Yellow squiggly lines indicate warnings
- Auto-fix on save is enabled
- Use `Cmd+.` / `Ctrl+.` for quick fixes

### Prettier

- Auto-formats on save
- Consistent code style across the project
- Works with TypeScript, JavaScript, JSON, CSS

### TypeScript

- Real-time type checking
- IntelliSense for auto-completion
- Auto-imports for modules
- Rename symbol across files

### Path Intellisense

- Auto-complete file paths in imports
- Works with your configured path aliases (`@/`, `@/components/`, etc.)

## 📁 Project Structure Quick Reference

```text
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utility libraries
├── hooks/             # Custom React hooks
└── middleware/        # Custom middleware
```

## 🎨 Code Style Guidelines

### Prettier Configuration

- Single quotes for strings
- Semicolons enabled
- 2-space indentation
- 80 character line length
- Trailing commas where valid

### ESLint Rules

- Prefer `const` over `let`
- Warn about unused variables
- Warn about console.log statements
- React hooks dependency warnings

## 🔍 Testing Your Setup

Open `src/components/test/ExtensionTest.tsx` to verify:

1. **ESLint**: You should see warnings for unused variables and console.log
2. **Prettier**: Save the file to see auto-formatting
3. **Tailwind**: Type new classes to see IntelliSense
4. **TypeScript**: Hover over variables to see types
5. **Auto Rename Tag**: Try renaming a JSX tag

## 🐛 Troubleshooting

### Extensions Not Working?

1. Check if extensions are installed: `Cmd+Shift+X`
2. Reload window: `Cmd+Shift+P` → "Developer: Reload Window"
3. Check output panel for errors: View → Output

### Prettier Not Formatting?

1. Ensure "Format on Save" is enabled in settings
2. Check if Prettier is set as default formatter
3. Save file manually with `Cmd+S`

### ESLint Not Showing Errors?

1. Check if `.eslintrc.json` exists
2. Restart TypeScript server: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
3. Check ESLint output in problems panel

### Tailwind IntelliSense Not Working?

1. Ensure `tailwind.config.js` exists
2. Check if CSS file imports Tailwind directives
3. Restart window if needed

## 💡 Pro Tips

1. **Use the Command Palette**: `Cmd+Shift+P` is your best friend
2. **Multi-cursor editing**: Hold `Alt` and click for multiple cursors
3. **Quick file switching**: `Cmd+P` then type filename
4. **Symbol search**: `Cmd+Shift+O` to quickly find functions/classes
5. **Zen Mode**: `Cmd+K Z` for distraction-free coding
6. **Split Editor**: `Cmd+\` to split the editor view

## 🚀 Next Steps

1. Try creating a new component in `src/components/`
2. Test auto-imports by importing the component elsewhere
3. Experiment with Tailwind classes and see IntelliSense
4. Use the ESLint quick fixes to resolve warnings
5. Practice using shortcuts for faster development

---

Happy coding! 🎉
