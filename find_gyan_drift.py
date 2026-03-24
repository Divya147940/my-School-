
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_gyan_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_gyan = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'gyan'" in line:
            in_gyan = True
            print(f"GYAN START line {line_num}, balance={balance}")
            
        if in_gyan:
            if "{activeSection === 'fun'" in line:
                print(f"GYAN END detected by FUN start at line {line_num}, balance={balance}")
                in_gyan = False

find_gyan_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
