
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_actual_imbalance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove strings and comments to be safe
    # But for a quick check, let's just count <div and </div but subtract />
    
    div_opens = len(re.findall(r'<div(?!\s*/>)', content))
    # Wait, the above regex is tricky because <div can be followed by props and then />
    
    # Better: find all <div and check if they are self-closing
    all_divs = re.findall(r'<div[^>]*>', content)
    num_opens = 0
    for d in all_divs:
        if not d.endswith('/>'):
            num_opens += 1
            
    num_closes = len(re.findall(r'</div>', content))
    
    print(f"Opens (non-self-closing): {num_opens}")
    print(f"Closes: {num_closes}")
    print(f"Diff: {num_opens - num_closes}")

find_actual_imbalance(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
