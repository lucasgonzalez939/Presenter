# Presenter Formatting Syntax - Quick Reference

## 🎨 Text Formatting

| Syntax | Result | Example |
|--------|--------|---------|
| `*text*` | **Bold** | `*Important*` |
| `##text##` | Background highlight | `##Key Point##` |

## 🌈 Colors

| Syntax | Color |
|--------|-------|
| `#red#text#` | 🔴 Red |
| `#blue#text#` | 🔵 Blue |
| `#green#text#` | 🟢 Green |
| `#yellow#text#` | 🟡 Yellow |
| `#orange#text#` | 🟠 Orange |
| `#purple#text#` | 🟣 Purple |
| `#white#text#` | ⚪ White |

## 📐 Layout

| Syntax | Effect |
|--------|--------|
| `\n` | Single line break |
| `\|\|\|` | Multiple line breaks (spacing) |
| `#center#text#end#` | Centered text block |

## 💡 Combining Formats

```
*#red#Bold red text#*
*#blue#Bold blue title#*
##*Highlighted bold text*##
#center#*Main Title*#end#
```

## 📋 Example Slide

```json
{
  "name": "Example",
  "content": "#center#*Welcome*#end#\n|||\n#blue#Subtitle here#\n|||\nPoint 1: #green#Success#\nPoint 2: ##Important##\nPoint 3: *Emphasized*"
}
```

## 🤖 Quick LLM Prompt

```
Create a [TOPIC] presentation in Presenter JSON format with [N] slides.
Use: *bold*, #color#text#, ##highlight##, ||| spacing, #center#text#end#
```

---

**Tip:** Combine any formats! Example: `*#green#Bold Green Text#*`
