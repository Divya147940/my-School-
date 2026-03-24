
import re

def find_imbalance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_match = re.search(r'return\s*\(', content)
    if not start_match: return
    
    start_pos = start_match.start()
    balance_paren = 0
    balance_brace = 0
    div_balance = 0
    
    lines = content.splitlines()
    curr_pos = 0
    
    # We'll track it line by line but need to be careful with overlaps
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        div_balance += d_o
        div_balance -= d_c
        
        # For paren/brace, we'll do char by char in return block
        if curr_pos <= start_pos < curr_pos + len(line) + 1:
            # We are inside or starting the return block
            pass
            
        if curr_pos > start_pos:
            for char in line:
                if char == '(': balance_paren += 1
                elif char == ')': balance_paren -= 1
                elif char == '{': balance_brace += 1
                elif char == '}': balance_brace -= 1
        
        curr_pos += len(line) + 1
        
        if div_balance < 0 or balance_paren < 0 or balance_brace < 0:
            print(f"FAILED AT LINE {line_num}: div={div_balance}, paren={balance_paren}, brace={balance_brace}")
            # print line for context
            print(f"LINE: {line.strip()}")
            # Break to find first error
            break

find_imbalance(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
