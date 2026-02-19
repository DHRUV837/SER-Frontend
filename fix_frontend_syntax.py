import os
import re

def fix_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Fix mixed backtick and double quote: `${API_URL}/...?"
    # Find patterns like `${API_URL}/something" and change " to `
    # This is tricky because " might be part of other things, but usually it's at the end of the URL string.
    
    # 1. Fix the space issue and mixed quotes specifically for our pattern
    content = content.replace('` ${API_URL}/', '`${API_URL}/')
    
    # regex to find `${API_URL}/any_char_until_quote"
    # and replace with `${API_URL}/any_char_until_quote`
    content = re.sub(r'(`\$\{API_URL\}/[^"]+)"', r'\1`', content)
    
    # Also handle single quotes just in case
    content = re.sub(r"(`\$\{API_URL\}/[^']+)'", r'\1`', content)

    # Specific fix for the AdminDealManagement case: let url = `${API_URL}/admin/deals?";
    # After the above regex, it should be: let url = `${API_URL}/admin/deals?`;
    
    with open(file_path, 'w') as f:
        f.write(content)

def main():
    root_dir = 'frontend/src'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
