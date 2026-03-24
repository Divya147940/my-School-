
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_duniya_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_duniya = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'duniya'" in line:
            in_duniya = True
            print(f"DUNIYA START line {line_num}, balance={balance}")
            
        if in_duniya:
            if "{activeSection === 'gyan'" in line:
                print(f"DUNIYA END detected by GYAN start at line {line_num}, balance={balance}")
                in_duniya = False

find_duniya_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
