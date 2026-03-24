
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_imbalance_line(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Count non-self-closing opens
        d_o = 0
        for d in re.findall(r'<div[^>]*>', line):
            if not d.endswith('/>'):
                d_o += 1
        
        d_c = len(re.findall(r'</div>', line))
        
        new_balance = balance + d_o - d_c
        
        if line_num >= 285: # Start of return
            if new_balance > balance:
                pass # expected inside sections
            elif new_balance < balance:
                pass
            
            # Print balance for each section start/end to find which one drifts
            if '{activeSection ===' in line or ')}' in line:
                print(f"{line_num:4}: {new_balance:2} | {line.strip()[:60]}")
        
        balance = new_balance

find_imbalance_line(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
