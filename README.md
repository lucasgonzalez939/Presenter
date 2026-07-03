# Presenter
Quick project to show text on screen with as little as possible things in the way

## 🤖 LLM-Generated Presentations

You can use AI to automatically generate presentations! Just share `presentation-template.json` with an LLM (ChatGPT, Claude, etc.) and tell it what topic and how many slides you want.

The exported JSON can also store a background image configuration. Uploaded images are saved as text using a base64 data URL, so the image survives export/import without needing a separate asset file.

**Example prompt:**
```
Using this template, create a presentation about "Introduction to Python" with 5 slides
```

The template file includes embedded instructions so the LLM knows exactly how to format your presentation. Then just download and import it!

See `LLM-PROMPT-GUIDE.md` for detailed examples and `FORMATTING-REFERENCE.md` for syntax help.

