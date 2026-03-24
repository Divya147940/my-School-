
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_shala_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_shala = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'shala'" in line:
            in_shala = True
            print(f"SHALA START line {line_num}, balance={balance}")
            
        if in_shala:
            # print(f"{line_num:4}: {balance}")
            if "{activeSection === 'duniya'" in line:
                print(f"SHALA END detected by DUNIYA start at line {line_num}, balance={balance}")
                in_shala = False

find_shala_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
