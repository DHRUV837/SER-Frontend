import os
import re

def fix_syntax(directory):
    patterns = [
        # Fix `something' to 'something'
        (r"`([^`$'\n]+)'", r"'\1'"),
        # Fix `something" to "something"
        (r"`([^`$'\n]+)\"", r"'\1'"),
        # Fix "something` to "something"
        (r"\"([^`$'\n]+)`", r"'\1'"),
        # Fix `${var}" to `${var}`
        (r"(\${[^}]+})\"", r"\1`"),
        # Fix link: `/path' to link: '/path'
        (r": `([^`$'\n]+)'", r": '\1'"),
        # Fix link: '/path` to link: '/path'
        (r": '([^`$'\n]+)`", r": '\1'"),
        # Fix Link to={`...${var}"} to Link to={`...${var}`}
        (r"({`[^`]*\${[^}]+}[^`]*)\"}", r"\1`}"),
        # Fix className={`...${var ? `...` : `...`}`} nested backticks logic (broken by my previous script)
        (r"(\${[^?]+\? )`([^`']*)' : ''}`", r'\1"\2" : ""`'),
        # Fix specific instances found in logs
        (r"'Unknown'}", r"'Unknown'}"), # Already correct if it was a backtick error, but let's be safe
        (r"`Unknown'}", r"'Unknown'}"),
        (r"`fulfilled'}", r"'fulfilled'}"),
        (r"`fulfilled'", r"'fulfilled'"),
        (r'`bg-red-100 text-red-600\'', r'\'bg-red-100 text-red-600\''),
    ]

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                
                # Fix the backtick strings ending with double quote
                # Example: `${id}" or `${id}" }
                new_content = re.sub(r"(\${[^}]+})\"", r"\1`", new_content)
                
                # Fix className with mixed quotes
                new_content = new_content.replace("`hidden lg:block'", "'hidden lg:block'")
                new_content = new_content.replace("`bg-slate-100 dark...'", "'bg-slate-100 dark...'")
                
                # Fix the double quote at the end of a template literal
                # Find occurrences of `...${...}..."
                new_content = re.sub(r"(`[^`]*\${[^}]+}[^`]*)(\")", r"\1` patterns", new_content)
                # Wait, the above is tricky. Let's do specific common fixes first.
                
                for pattern, replacement in patterns:
                    new_content = re.sub(pattern, replacement, new_content)

                # Fix DealHistory.jsx specifically
                new_content = new_content.replace('"} fill="none"', '`} fill="none"')
                new_content = new_content.replace('Link to={`/sales/my-deals/${deal.id}"}', 'Link to={`/sales/my-deals/${deal.id}`}')

                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed syntax in: {path}")

if __name__ == "__main__":
    fix_syntax("frontend/src")
