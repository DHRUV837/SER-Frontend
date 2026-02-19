import os
import re

def fix_content(content):
    # Common broken template literals
    # `${API_URL}/... ' -> `${API_URL}/... `
    content = re.sub(r'(\${[^}]+}[^`\'"]*)\'', r'\1`', content)
    content = re.sub(r'(\${[^}]+}[^`\'"]*)"', r'\1`', content)
    
    # Broken simple quotes
    # 'All" -> 'All'
    content = re.sub(r" '([^'\"]+)\"", r" '\1'", content)
    content = re.sub(r" \"([^'\"]+)'", r" \"\1\"", content)
    
    # className='... " -> className='... '
    content = re.sub(r"className='([^'\"]+)\"", r"className='\1'", content)
    content = re.sub(r"className=\"([^'\"]+)'", r"className=\"\1\"", content)
    
    # Specific broken lines found in logs
    content = content.replace("/read')", "/read`")
    content = content.replace("\"Sync read failed',", "\"Sync read failed\",")
    content = content.replace("`&requestorId=${auth.user.id}'", "`&requestorId=${auth.user.id}`")
    content = content.replace("cursor-pointer\"", "cursor-pointer'")
    content = content.replace("('/admin/performance/${user.id}`)", "(`/admin/performance/${user.id}`)")
    content = content.replace("filter === 'All\"", "filter === 'All'")
    content = content.replace("'download\", '", "'download', '")
    content = content.replace(".toISOString().split('T')[0].csv`);", ".toISOString().split('T')[0]}.csv`);") # Fix missing }
    
    # Fix the `${var}%" : "N/A"}` stuff
    content = content.replace('%" : "N/A"}', '%` : "N/A"}')
    
    # Fix broken backticks that should be quotes
    content = re.sub(r"([ \t])`([^`\$\n]+)'", r"\1'\2'", content)
    content = re.sub(r"([ \t])'([^`\$\n]+)`", r"\1'\2'", content)

    # General cleanup for `${...}` followed by a single quote instead of backtick
    content = re.sub(r"(\${[^}]+}[^`]*)'", r"\1`", content)
    
    return content

def main():
    directory = "frontend/src"
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = fix_content(content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed: {path}")

if __name__ == "__main__":
    main()
