# VE - Universal UI Generator

## Project Architecture

This is a **self-contained UI generation system** built as a single Jupyter notebook (`Untitled-1.ipynb`) containing the complete `ui_generator.py` module. The project generates responsive website scaffolds from configuration objects.

### Core Components

- **Single-file architecture**: All functionality in `AI Developer Helper.ipynb` as executable Python code
- **Template-based generation**: Uses `string.Template` for HTML/CSS/JS scaffolding
- **Configuration-driven**: JSON configs control themes, layouts, and component visibility
- **Zero dependencies**: Uses only Python standard library (`os`, `json`, `pathlib`, `webbrowser`, `string`)

### Key Functions & Patterns

```python
# Main entry point - generates complete UI scaffold
generate_ui(config=None, output_dir="ui_output", open_in_browser=False)

# Configuration merging pattern used throughout
cfg = dict(DEFAULT_CONFIG)
if config:
    for k, v in config.items():
        if isinstance(v, dict) and k in cfg:
            cfg[k].update(v)  # Deep merge for nested dicts
        else:
            cfg[k] = v
```

### Output Structure

Generated sites follow this pattern:
```
output_dir/
├── index.html       # Main template with substituted values
├── styles.css       # CSS with theme variables
├── script.js        # Minimal interactivity
└── ui_config.json   # Configuration used for reproducibility
```

### Configuration Schema

Key config sections to understand:
- `theme`: Colors, fonts, border radius (`primary`, `background`, `muted`, `radius`, `font`)
- `layout`: Component visibility (`show_nav`, `show_hero`, `cards_count`, `show_form`)
- `brand`: Logo styling (`logo_text`, `logo_bg`, `logo_color`)

### Development Workflow

1. **Interactive development**: Work directly in the Jupyter notebook
2. **Testing**: Run `generate_ui()` with `open_in_browser=True` for instant preview
3. **Configuration changes**: Modify `DEFAULT_CONFIG` or pass custom config objects
4. **Template updates**: Edit `HTML_TEMPLATE`, `CSS_TEMPLATE`, or `JS_TEMPLATE` constants

### VS Code Configuration

- Python type checking set to "standard" mode in `.vscode/settings.json`
- No external dependencies or build process
- Notebook-first development approach

### Extending the Generator

- **New components**: Add rendering functions following `_render_*()` pattern
- **Theme variables**: Extend CSS `:root` variables in `CSS_TEMPLATE`
- **Interactivity**: Expand `JS_TEMPLATE` with new `data-action` handlers
- **Configuration**: Add new sections to `DEFAULT_CONFIG` schema

This project prioritizes simplicity and self-containment over traditional project structure.