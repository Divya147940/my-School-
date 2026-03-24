
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_magic_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_magic = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'magic'" in line:
            in_magic = True
            print(f"MAGIC START line {line_num}, balance={balance}")
            
        if in_magic:
            if "{activeSection === 'cartoon'" in line:
                print(f"MAGIC END detected by CARTOON start at line {line_num}, balance={balance}")
                in_magic = False

find_magic_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
