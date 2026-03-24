
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_center_content = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if '<div className="center-content' in line:
            in_center_content = True
            
        if in_center_content:
            # Between sections (not inside an activeSection block), balance should be 2
            if 'activeSection ===' in line and '&& (' in line:
                if balance != 2:
                    print(f"DRIFT DETECTED at line {line_num}: balance is {balance}, expected 2")
                    # print previous 5 lines for context
                    for j in range(max(0, i-5), i+1):
                        print(f"{j+1:4}: {lines[j].strip()}")
                    break

find_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
