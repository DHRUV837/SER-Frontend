import os
import re

def comprehensive_fix(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Pattern: `(anything without backtick) followed by " or '
    # This is dangerous if we match too much. Let's be specific for the cases we saw:
    # 1. `₹' -> '₹' (since it doesn't have variables)
    # 2. `Rejected' -> 'Rejected'
    # 3. `Approved' -> 'Approved'
    # 4. `Error fetching...:" -> "Error fetching...:"
    # 5. className=`some-classes" -> className="some-classes"

    # Fix specific common broken patterns first
    content = content.replace("`₹'", "'₹'")
    content = content.replace("`Approved'", "'Approved'")
    content = content.replace("`Rejected'", "'Rejected'")
    
    # Fix className artifacts
    content = re.sub(r'className=`([^`"]+)"', r'className="\1"', content)
    
    # Fix backtick-started but double-quote ended strings
    # This handles console.error(`msg", error) -> console.error("msg", error)
    content = re.sub(r'(`)([^`$\n]+)(")', r'"\2"', content)

    # Fix backtick wrapping a string but using $ incorrectly or just mixed
    # e.g. `status: `Approved' -> status: 'Approved' (handled above)
    
    # Fix the space between backtick and ${
    content = content.replace('` ${API_URL}', '`${API_URL}')

    with open(file_path, 'w') as f:
        f.write(content)

def main():
    root_dir = 'frontend/src'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                comprehensive_fix(os.path.join(root, file))

if __name__ == "__main__":
    main()
