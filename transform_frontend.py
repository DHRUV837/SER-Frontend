import os
import re

def get_relative_path(file_path):
    # Calculate depth from src
    rel_path = os.path.relpath('frontend/src', os.path.dirname(file_path))
    if rel_path == '.':
        return './api'
    return os.path.join(rel_path, 'api')

def transform_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    if 'http://localhost:8080' not in content:
        return

    print(f"Transforming: {file_path}")
    
    # Check if we need to replace axios with api instance
    use_api_instance = False
    if 'axios.get("http://localhost:8080/' in content or \
       'axios.post("http://localhost:8080/' in content or \
       'axios.put("http://localhost:8080/' in content or \
       'axios.delete("http://localhost:8080/' in content:
        use_api_instance = True

    rel_import = get_relative_path(file_path)

    if use_api_instance:
        content = content.replace('import axios from "axios";', f'import api from "{rel_import}";')
        content = content.replace('axios.get("http://localhost:8080/', 'api.get("/')
        content = content.replace('axios.post("http://localhost:8080/', 'api.post("/')
        content = content.replace('axios.put("http://localhost:8080/', 'api.put("/')
        content = content.replace('axios.delete("http://localhost:8080/', 'api.delete("/')
        
    # Handle remaining strings (like in template literals or variables)
    if 'http://localhost:8080' in content:
        # Import API_URL if not already using api instance (or if we need both)
        if 'API_URL' not in content:
            if 'import api' in content:
                content = content.replace(f'import api from "{rel_import}";', f'import api, {{ API_URL }} from "{rel_import}";')
            else:
                # Add import at the top
                content = f'import {{ API_URL }} from "{rel_import}";\n' + content
        
        # Replace occurrences in various contexts
        content = content.replace('"http://localhost:8080/', '`${API_URL}/')
        content = content.replace("'http://localhost:8080/", "`${API_URL}/")
        
        # Fixing backticks if they were already there
        content = content.replace('`${API_URL}/', '`${API_URL}/') # No change needed for most
        
        # Clean up double backticks if and only if they were added wrongly
        content = re.sub(r'([^`])`(\$\{API_URL\}/[^`]+)`', r'\1` \2`', content) # Complex, safer to just replace
        content = content.replace('http://localhost:8080', '${API_URL}')

    with open(file_path, 'w') as f:
        f.write(content)

def main():
    root_dir = 'frontend/src'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                transform_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
