# LLM Prompt Template for Presenter

Use this template to ask an LLM (like ChatGPT, Claude, etc.) to create presentations for you.

## Basic Prompt Template

```
Create a presentation in JSON format for the Presenter app about [TOPIC].

The presentation should have [NUMBER] slides covering:
- [POINT 1]
- [POINT 2]
- [POINT 3]

Use the following formatting syntax:
- *text* = Bold text
- #red#text# = Red colored text (also: blue, green, yellow, orange, purple, white)
- ##text## = Text with yellow background highlight
- #center#text#end# = Centered text block
- ||| = Multiple line breaks (large spacing)
- \n = Single line break

Format as JSON with this structure:
{
  "texts": {
    "tab1": {"name": "Slide Title", "content": "Slide content here"},
    "tab2": {"name": "Slide Title", "content": "Slide content here"}
  },
  "activeTab": "tab1",
  "config": {"prevKey": "ArrowLeft", "nextKey": "ArrowRight", "isDarkMode": true}
}

Guidelines:
- Keep text concise (auto-scales to fit screen)
- Use ||| for spacing between sections
- Use colors strategically for emphasis
- Use *bold* for titles
- Use #center#text#end# for slide titles
- Combine formats: *#blue#bold blue text#*
```

## Example Prompts

### 1. Business Presentation
```
Create a presentation in JSON format about "Quarterly Sales Results Q4 2025" with 6 slides:
1. Title slide with company name
2. Executive summary with key metrics
3. Revenue breakdown by region
4. Top performing products
5. Challenges and solutions
6. Q1 2026 Goals

Use the Presenter formatting syntax. Make titles centered and bold. Use colors for positive (green) and negative (red) metrics. Use ||| for spacing.
```

### 2. Educational Content
```
Create a presentation about "Introduction to Photosynthesis" for high school students with 5 slides:
1. Title slide
2. What is photosynthesis?
3. The process (steps)
4. Why it matters
5. Summary

Use Presenter formatting. Make it engaging with colors. Use *bold* for key terms and ##highlight## for important facts.
```

### 3. Technical Workshop
```
Create a coding workshop presentation about "Python Basics" with 7 slides covering:
- Welcome
- Variables and Types
- Control Flow
- Functions
- Lists and Dictionaries
- Best Practices
- Resources

Use Presenter JSON format with syntax highlighting using different colors for different concepts.
```

## Formatting Best Practices for LLMs to Follow

When requesting presentations, tell the LLM to:

1. **Use centered titles**: `#center#*Slide Title*#end#`
2. **Add spacing**: Use `|||` between major sections
3. **Color code information**:
   - `#green#` for positive/success
   - `#red#` for warnings/important
   - `#blue#` for neutral information
   - `#yellow#` for highlights
4. **Combine formats**: `*#blue#bold blue text#*`
5. **Keep it concise**: Text auto-scales, so less is more
6. **Use background highlights**: `##key facts##` for emphasis
7. **Logical tab names**: Short, descriptive slide names

## Advanced Prompt Example

```
Create a professional presentation for "Product Launch - SmartHome AI Assistant" with the following structure:

Slide 1 (Intro):
- Centered bold title
- Tagline in blue
- Large spacing before "Press → to begin"

Slide 2 (Problem):
- Title: "The Problem"
- 3 pain points in red
- Statistics with background highlight

Slide 3 (Solution):
- Title: "Our Solution"
- Product name in bold blue
- 4 key features in green with bullets

Slide 4 (How It Works):
- Title centered
- 3-step process with numbers
- Each step in different color

Slide 5 (Benefits):
- Benefits listed with checkmarks
- Key metrics highlighted
- Comparison points

Slide 6 (CTA):
- Centered bold call-to-action
- Contact info in white
- Thank you message

Use Presenter JSON format with all available formatting options. Make it visually engaging and professional.
```

## Copy-Paste Template for Quick Use

```
I need a presentation for the Presenter app. Create it in JSON format.

Topic: [YOUR TOPIC]
Number of slides: [NUMBER]
Audience: [WHO IS IT FOR]
Key points to cover: [LIST THEM]

Use this formatting:
- *text* = bold
- #color#text# = colored (red/blue/green/yellow/orange/purple/white)
- ##text## = yellow background
- #center#text#end# = centered
- ||| = big spacing

JSON structure:
{
  "texts": {
    "tab1": {"name": "Title", "content": "formatted content"},
    "tab2": {"name": "Title", "content": "formatted content"}
  },
  "activeTab": "tab1",
  "config": {"prevKey": "ArrowLeft", "nextKey": "ArrowRight", "isDarkMode": true}
}

Make it professional and visually appealing.
```

## Tips for Best Results

1. **Be specific** about your topic and audience
2. **Specify the number of slides** you want
3. **Mention key points** to cover
4. **Request specific color schemes** if needed
5. **Ask for examples or data** if relevant
6. **Specify tone** (professional, casual, educational, etc.)
7. **Request revisions** - you can ask the LLM to adjust colors, spacing, or content

## After Getting the JSON

1. Copy the JSON from the LLM's response
2. Open Presenter app
3. Click the ⬆️ (Import) button
4. Select the JSON file or paste the content
5. Navigate with arrow keys or click

## Example: Complete LLM Conversation

**You:** 
> Create a presentation about "Time Management Tips" with 5 slides for busy professionals. Use Presenter JSON format with colors and formatting.

**LLM Response:**
> [Would generate a complete JSON with formatted slides]

**You (if needed):**
> Make the tips in green and add more spacing between sections

**LLM Response:**
> [Updated JSON with your changes]

---

Save this file and use it anytime you want to quickly generate presentations!
